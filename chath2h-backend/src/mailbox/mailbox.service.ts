import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDto } from './dto/message.dto';
import { User } from 'src/users/entities/user.entity';
import { ObjectId } from 'mongodb';
import { Conversation } from './entities/conversation.entity';
import { ConversationDto } from './dto/conversation.dto';
import { MailService } from 'src/mail/mail.service';
import { TemplatesService } from 'src/mailTemplates/templates.service';

import MessageBrokerService from 'src/communication/broker/broker.service';
import { ConversationRequest } from './dto/conversation.request';
import { ParticipantStatusService } from 'src/chat/services/participant-status.service';
import { ConversationGroupedCollection } from './dto/conversation-grouped.collection.dto';
import { MailboxUnreadMessagesRequest } from './dto/mailbox-unread-messages.request';
import { MailboxMagicLinkService } from 'src/magic-link-creator/mailbox-magic-link.service';
import { MailboxMagicLinkDto } from 'src/magic-link-creator/mailbox-magic-link.dto';
import { Settings } from 'src/settings';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import { Files } from 'src/files/entity/files.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class MailboxService {
  private readonly logger = new Logger(MailboxService.name);
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly templatesService: TemplatesService,
    private readonly messageBroker: MessageBrokerService,
    private readonly participantStatus: ParticipantStatusService,
    private readonly mailboxMagicLinkService: MailboxMagicLinkService,
    private readonly i18n: I18nService,
  ) {}

  public async send(message: MessageDto, isInvitationMessage = false) {
    if (message.from.toString() === message.to) {
      const error = `Unable to send a message to yourself!`;
      console.error(error);
      throw new BadRequestException(error);
    }

    if (!this.userModel.exists({ _id: message.to })) {
      const error = `Unable to send message, recipient with id #${message.to} not found`;
      console.error(error);
      throw new BadRequestException(error);
    }

    const conversationQuery = {
      $and: [
        {
          [`${message.conversationContext}`]: new ObjectId(
            message.conversationContextId,
          ),
          $or: [
            {
              $and: [
                { participant1: new ObjectId(message.from) },
                { participant2: new ObjectId(message.to) },
              ],
            },
            {
              $and: [
                { participant2: new ObjectId(message.from) },
                { participant1: new ObjectId(message.to) },
              ],
            },
          ],
        },
      ],
    };
    try {
      let existingConversation: Conversation =
        await this.conversationModel.findOne(conversationQuery);
      if (existingConversation == null) {
        const conversation = new ConversationDto();
        conversation.participant1 = message.from;
        conversation.participant2 = message.to;
        conversation[`${message.conversationContext}`] =
          message.conversationContextId;
        conversation.owner = message.from;
        conversation.messagesLimit = Settings.FREE_MESSAGES_LIMIT;
        existingConversation = await this.conversationModel.create(
          conversation,
        );
        this.unblockConversation(existingConversation); // initial unblocking
      }

      //check if conversation blocking time passed
      if (this.isBlockedTimePassed(existingConversation)) {
        this.unblockConversation(existingConversation);
      }

      //check if conversation is blocked for sender
      if (
        this.validateIsBlocked(message.from.toString(), existingConversation) &&
        !message.systemMessage
      ) {
        const error = `Unable send message, conversation ${existingConversation._id} is blocked for user ${message.from} due to number of messages`;
        console.info(error);
        throw new BadRequestException(error);
      }

      const result = await this.messageModel.create(message);
      existingConversation.messages.push(result._id);
      if (!message.systemMessage) {
        existingConversation.messagesCount =
          Number(existingConversation.messagesCount || 0) + 1;

        existingConversation.participantsLimits.set(
          message.from.toString(),
          Number(
            existingConversation.participantsLimits.get(
              message.from.toString(),
            ),
          ) + 1,
        );
      }
      const mailConversationContext = `mailbox?conversationId=${existingConversation._id}`;
      await Promise.all([
        await existingConversation.save(),
        this.sendMailNotification(
          mailConversationContext,
          result,
          isInvitationMessage,
        ),
        this.sendSocketNotification(existingConversation, result),
      ]);
      const newResult = result.toObject();
      return { ...newResult, existingConversationId: existingConversation.id };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  private validateIsBlocked(user: string, conversation: Conversation) {
    return (
      this.isBlockedFor(user, conversation) &&
      !this.isBlockedTimePassed(conversation)
    );
  }

  private isBlockedTimePassed(conversation: Conversation): boolean {
    const now = new Date();
    const updatedAt = new Date(conversation.updatedAt);
    const endDate = new Date(updatedAt.getTime());
    endDate.setDate(updatedAt.getDate() + 7);
    return endDate < now;
  }

  private isBlockedFor(user: string, conversation: Conversation): boolean {
    return (
      Number(conversation.participantsLimits.get(user)) >=
      conversation.messagesLimit
    );
  }

  private unblockConversation(conversation: Conversation) {
    [
      conversation.participant1._id.toString(),
      conversation.participant2._id.toString(),
    ].forEach((p) => {
      conversation.participantsLimits.set(p, 0);
    });
  }

  public async findAndClearConversationLimit(
    needOfferId: string,
    user: string,
    coach: string,
  ) {
    const conversationQuery = {
      $and: [
        {
          $or: [
            { need: new ObjectId(needOfferId) },
            { coachOffer: new ObjectId(needOfferId) },
          ],
        },
        {
          $or: [
            {
              $and: [
                { participant1: new ObjectId(user) },
                { participant2: new ObjectId(coach) },
              ],
            },
            {
              $and: [
                { participant2: new ObjectId(user) },
                { participant1: new ObjectId(coach) },
              ],
            },
          ],
        },
      ],
    };

    const existingConversation: Conversation =
      await this.conversationModel.findOne(conversationQuery);
    if (!existingConversation) return;
    this.unblockConversation(existingConversation);
    await existingConversation.save();
  }

  public async getConversation(
    need: string,
    coachOffer: string,
    user: string,
    coach: string,
  ): Promise<Conversation> {
    return this.conversationModel
      .find({
        $and: [
          {
            $or: [
              {
                $and: [
                  { participant1: new ObjectId(user) },
                  { participant2: new ObjectId(coach) },
                ],
              },
              {
                $and: [
                  { participant2: new ObjectId(user) },
                  { participant1: new ObjectId(coach) },
                ],
              },
            ],
          },
          {
            $or: [{ need: need }, { coachOffer: coachOffer }],
          },
        ],
      })
      .lean();
  }

  public async getConversations(
    user: string,
  ): Promise<ConversationGroupedCollection> {
    const resultCollection = new ConversationGroupedCollection();
    const conversations = this.conversationModel
      .find(
        {
          $or: [
            { participant1: new ObjectId(user) },
            { participant2: new ObjectId(user) },
          ],
        },
        'participant1 participant2 createdAt updatedAt messagesLimit owner participantsLimits',
      )
      .populate({
        path: 'messages',
        select: 'content viewed from to createdAt _id systemMessage',
      })
      .populate({
        path: 'need',
        select: 'problemTitle',
        populate: {
          path: 'user',
          select: '_id firstName walletAddress',
        },
      })
      .populate({
        path: 'coachOffer',
        select: 'problemTitle',
        populate: {
          path: 'user',
          select: '_id firstName walletAddress',
        },
      })
      .populate({
        path: 'participant1',
        select: '_id',
        populate: {
          path: 'avatar firstName walletAddress coachProfile',
          select: 'filename',
        },
      })
      .populate({
        path: 'participant2',
        select: '_id',
        populate: {
          path: 'avatar firstName walletAddress coachProfile',
          select: 'filename',
        },
      })
      .sort({ updatedAt: -1 })
      .exec();

    (await conversations).forEach((c) => {
      const conversation = c.toObject({ virtuals: true });
      conversation.messagesCount = conversation.messages.filter(
        (m) => !m.systemMessage,
      ).length;
      conversation.messagesNotViewed = conversation.messages.filter(
        (m) => m.to.toString() === user && m.viewed === false,
      ).length;
      conversation.userMessageLimit = conversation.participantsLimits.get(user);
      resultCollection.add(user, conversation);
    });
    return resultCollection;
  }

  public async deleteConversation(
    user: string,
    conversationId: string,
  ): Promise<void> {
    const conversation = await this.conversationModel.findById(conversationId);
    if (conversation.owner._id.toString() != user) {
      const error = `Unable to delete conversation. User #${user} is not owner of conversation #${conversation._id}`;
      console.error(error);
      throw new BadRequestException(error);
    }

    await this.messageModel.deleteMany({
      _id: { $in: conversation.messages.map((m) => new ObjectId(m._id)) },
    });
    await this.conversationModel.deleteOne({
      _id: new ObjectId(conversationId),
    });
  }

  private async sendMailNotification(
    conversationContext: string,
    message: Message,
    isInvitation = false,
  ) {
    const from = await this.userModel.findById(message.from).populate<{
      avatar: Files;
    }>('avatar');

    const to = await this.userModel.findById(message.to);

    const toEmail = to.email;

    const mailboxMagicLink =
      this.mailboxMagicLinkService.createMailboxMagicLink(
        new MailboxMagicLinkDto(toEmail, conversationContext),
      );

    //for testing purpose  only
    this.logger.debug('mailbox magic link: ' + mailboxMagicLink);

    const separatorTranslate = '#@!$';

    const sliceMessage = (content: string) => {
      return content.length > 220 ? content.slice(0, 220) + '...' : content;
    };

    const checkIfSeparatorCharacter = (content: string) => {
      const splicedContent = content.split(separatorTranslate);
      return splicedContent.map((message: string, index) =>
        index === 1 ? sliceMessage(message) : this.i18n.t(`common.${message}`),
      );
    };

    const newMessage = message.content.includes(separatorTranslate)
      ? checkIfSeparatorCharacter(message.content).join('')
      : message.content;

    const template = this.templatesService.renderTemplate('newMailboxMessage', {
      url: mailboxMagicLink,
      avatar: `${Settings.BACKEND_URL}/files/${from.avatar.filename}`,
      content: newMessage,
      from: `${from.firstName}`,
      name: `${to.firstName}`,
      isInvitation,
    });
    try {
      await this.mailService.send({
        to: toEmail,
        subject: this.i18n.t('common.email-new-mailbox-message', {
          lang: I18nContext.current().lang,
        }),
        html: template,
      });
    } catch (error) {
      console.error(
        `Error sending mailbox message notification to ${to.email}: ${error}`,
      );
    }
  }

  private async sendSocketNotification(
    conversation: Conversation,
    message: Message,
  ) {
    this.messageBroker.send(new ConversationRequest(conversation._id, message));
  }

  private async sendSocketUnreadMessages(count: number, recipient: string) {
    this.messageBroker.send(
      new MailboxUnreadMessagesRequest(
        new MessageRecipient().add(recipient),
        count,
      ),
    );
  }

  public async updateViewedMessage(userId: string, conversationId: string) {
    
    if(!ObjectId.isValid(conversationId)) return;
    const conversation = await this.conversationModel
      .findById(conversationId)
      .populate('messages');

    const savePromises = [];

    for (const m of conversation.messages) {
      if (userId.toString() === m.to.toString()) {
        m.viewed = true;
        savePromises.push(m.save());
      }
    }
    await Promise.all(savePromises);

    const unreadMessagesCount = await this.getUnreadMessagesCount(userId);
    await this.sendSocketUnreadMessages(unreadMessagesCount, userId);
  }

  public async getUnreadMessagesCount(userId: string) {
    const unreadMessages = await this.messageModel.aggregate([
      { $match: { to: new ObjectId(userId), viewed: false } },
      { $count: 'unreadMessagesCount' },
    ]);
    return unreadMessages[0]?.unreadMessagesCount
      ? unreadMessages[0].unreadMessagesCount
      : 0;
  }
}
