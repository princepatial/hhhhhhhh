import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from '../entities/chat-message.entity';
import { Model } from 'mongoose';
import MessageRequest from '../dto/message.request';
import MessageBrokerService from 'src/communication/broker/broker.service';
import ChatMessageDto from '../dto/chat-message.dto';
import InteractionService from './interaction.service';
import MessageOnErrorRequest from '../dto/message-on-error.request';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import { Injectable } from '@nestjs/common';
import { Interaction } from '../entities/interaction.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export default class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<Interaction>,
    private readonly messageBroker: MessageBrokerService,
    private readonly interaction: InteractionService,
  ) {}

  public async sendMessage(messageRequest: ChatMessageDto) {
    if (messageRequest.from === messageRequest.to) {
      const error = `Cannot send messages to yourself!`;
      console.error(error);
      return this.messageBroker.send(new MessageOnErrorRequest(messageRequest));
    }

    const foundInteraction = await this.interaction.getInteractionInProgress(
      messageRequest.interactionId,
    );

    if (!foundInteraction) {
      const error = `Interaction ${messageRequest.from} not found for user ${messageRequest.to}. Can not send the message.`;
      console.error(error);
      return this.messageBroker.send(new MessageOnErrorRequest(messageRequest));
    }

    this.chatMessageModel.create(messageRequest);

    const recipientSocket =
      messageRequest.to == foundInteraction.coach._id.toString()
        ? foundInteraction.coachSocket
        : foundInteraction.userSocket;

    this.messageBroker.send(
      new MessageRequest(
        new MessageRecipient().addWithSocket(
          messageRequest.to,
          recipientSocket,
        ),
        messageRequest,
      ),
    );
  }

  public async getMessages(needOffer: string, user: string, recipient: string) {
    const userId = new ObjectId(user);
    const recipientId = new ObjectId(recipient);
    const needOfferId = new ObjectId(needOffer);
    const needOfferInteractions = await this.interactionModel.find({
      $and: [
        { $or: [{ need: needOfferId }, { coachOffer: needOfferId }] },
        {
          $or: [
            { user: userId, coach: recipientId },
            { user: recipientId, coach: userId },
          ],
        },
      ],
    });
    const interactionsIds = needOfferInteractions.map(
      (interaction) => interaction._id,
    );
    return this.chatMessageModel
      .find(
        {
          interactionId: { $in: interactionsIds },
        },
        {},
        { sort: { createdAt: 1 } },
      )
      .populate([
        {
          path: 'from',
          select: 'firstName avatar',
          populate: {
            path: 'avatar',
            select: 'filename',
          },
        },
        {
          path: 'to',
          select: 'firstName avatar',
          populate: {
            path: 'avatar',
            select: 'filename',
          },
        },
      ]);
  }
}
