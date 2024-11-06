import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import InterationRequestDto from '../dto/interaction-request.dto';
import MessageBrokerService from 'src/communication/broker/broker.service';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { InteractionRequest } from '../entities/interaction-request.entity';
import InteractionInvitationRequest from '../dto/interaction-invitation.request';
import InteractionRequestUser from '../dto/interaction-request-user.dto';
import { MessageDto } from 'src/mailbox/dto/message.dto';
import { InteractionRequestStatus } from '../dto/interaction-request-status.enum';
import InteractionService from './interaction.service';
import { Conversation } from 'src/mailbox/entities/conversation.entity';
import { Settings } from 'src/settings';
import InteractionExpiredRequest from '../dto/interaction-expired-request.request';
import { InteractionRequestStatusService } from './interaction-request-status.service';
import { ObjectId } from 'mongodb';
import InteractionRequestDeclinedRequest from '../dto/interaction-request-declined.request';
import { TokenTransactionService } from 'src/tokenTransaction/token-transaction.service';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import { ConversationContext } from 'src/mailbox/dto/conversation-context';

@Injectable()
export default class InteractionRequestService {
  constructor(
    @InjectModel(InteractionRequest.name)
    private readonly interactionRequestModel: Model<InteractionRequest>,
    private readonly messageBroker: MessageBrokerService,
    private readonly mailboxService: MailboxService,
    private readonly interactionService: InteractionService,
    private readonly interactionRequestStatus: InteractionRequestStatusService,
    private readonly tokenTransactionService: TokenTransactionService,
  ) {}

  public async setUpdateTime(_id: string, date: Date) {
    await this.interactionRequestModel.updateOne(
      { _id },
      {
        $set: {
          updatedAt: date,
        },
      },
    );
  }

  public async createInteractionRequest(interactionDto: InterationRequestDto) {
    this.isSelfInitiatedChatCheck(interactionDto.coach, interactionDto.user);

    if (interactionDto.initiator != interactionDto.coach)
      await this.isInsufficientFundsCheck(interactionDto.user);

    //check if any before conversation exists between coach and user regardin particular need/coach offer
    const conversation: Conversation =
      await this.mailboxService.getConversation(
        interactionDto.need,
        interactionDto.coachOffer,
        interactionDto.user,
        interactionDto.coach,
      );
    interactionDto.conversation = conversation?._id;
    const interactionRequest = await (
      await this.interactionRequestModel.create(interactionDto)
    ).populate([
      { path: 'initiator', select: 'firstName lastName' },
      { path: 'coachOffer', select: 'problemTitle' },
      { path: 'need', select: 'problemTitle' },
    ]);
    const recipient =
      interactionDto.initiator == interactionDto.coach
        ? interactionDto.user
        : interactionDto.coach;
    this.messageBroker.send(
      new InteractionInvitationRequest(
        new MessageRecipient().add(recipient),
        interactionRequest._id.toString(),
      ),
    );
    const invitationTopic =
      interactionRequest.need == null
        ? interactionRequest.coachOffer.problemTitle
        : interactionRequest.need.problemTitle;
    this.mailboxService.send(
      new MessageDto({
        conversationContextId: interactionRequest.need
          ? interactionRequest.need.id
          : interactionRequest.coachOffer.id,
        conversationContext: interactionRequest.need
          ? ConversationContext.NEED
          : ConversationContext.COACH_OFFER,
        from: interactionDto.initiator,
        to: recipient,
        content: `${invitationTopic}`,
        systemMessage: true,
      }),
      true,
    );
    return { requestId: interactionRequest._id.toString() };
  }

  public async acceptInteractionRequest(
    interactionRequestUser: InteractionRequestUser,
  ) {
    const interactionRequest = await this.getInteractionRequest(
      interactionRequestUser,
    );
    if (
      interactionRequest.initiator._id.toString() ===
      interactionRequest.coach._id.toString()
    )
      await this.isInsufficientFundsCheck(
        interactionRequest.user._id.toString(),
      );
    //all paticipants joined, finish interaction request
    await this.interactionRequestStatus.updateStatus(
      interactionRequest,
      InteractionRequestStatus.FINISHED,
    );
    //init interaction
    await this.interactionService.initInteraction(
      interactionRequest,
      interactionRequestUser,
    );
  }

  public async declineInteractionRequest(
    interactionRequestUser: InteractionRequestUser,
  ) {
    const interactionRequest = await this.getInteractionRequest(
      interactionRequestUser,
    );
    const recipient =
      interactionRequest.coach._id.toString() ===
      interactionRequestUser.user.toString()
        ? interactionRequest.user._id.toString()
        : interactionRequest.coach._id.toString();
    this.messageBroker.send(
      new InteractionRequestDeclinedRequest(
        new MessageRecipient().add(recipient),
        interactionRequestUser.interactionRequestId,
      ),
    );
    await this.interactionRequestStatus.updateStatus(
      interactionRequest,
      InteractionRequestStatus.DECLINED,
    );
  }

  public async getActiveRequests(user: string): Promise<InteractionRequest[]> {
    return this.interactionRequestModel
      .find({
        $and: [
          {
            $or: [{ user: user }, { coach: user }],
          },
          {
            status: InteractionRequestStatus.IN_PROGRESS,
          },
        ],
      })
      .populate({
        path: 'need',
        select: 'problemTitle',
      })
      .populate({
        path: 'coachOffer',
        select: 'problemTitle',
      })
      .populate({
        path: 'user',
        select: 'firstName lastName walletAddress',
        populate: {
          path: 'avatar',
          select: 'filename',
        },
      })
      .populate({
        path: 'coach',
        select: 'firstName lastName walletAddress',
        populate: {
          path: 'coachProfile.coachPhoto avatar',
          select: 'filename filename',
        },
      })
      .exec();
  }

  public async getActiveRequest(id: string): Promise<InteractionRequest> {
    return this.interactionRequestModel
      .findById(id)
      .populate({
        path: 'need',
        select: 'problemTitle',
      })
      .populate({
        path: 'coachOffer',
        select: 'problemTitle',
      })
      .populate({
        path: 'user',
        select: 'firstName lastName',
        populate: {
          path: 'avatar',
          select: 'filename',
        },
      })
      .populate({
        path: 'coach',
        select: 'firstName lastName',
        populate: {
          path: 'coachProfile.coachPhoto avatar',
          select: 'filename filename',
        },
      });
  }

  private async getInteractionRequest(
    interactionRequestUser: InteractionRequestUser,
  ): Promise<InteractionRequest> {
    const interactionRequest = await this.interactionRequestModel.findOne({
      $and: [
        {
          $or: [
            { user: interactionRequestUser.user },
            { coach: interactionRequestUser.user },
          ],
        },
        {
          _id: new ObjectId(interactionRequestUser.interactionRequestId),
        },
      ],
    });
    if (interactionRequest == null) {
      const error = `Interaction request ${interactionRequestUser.interactionRequestId} not found for user ${interactionRequestUser.user}`;
      console.error(error);
      throw new BadRequestException(error);
    }

    return interactionRequest;
  }

  async closeExpiredRequests(): Promise<void> {
    const pastDate = this.calculatePastDate();
    const pastInteractionRequests = await this.findPastInProgressRequests(
      pastDate,
    );

    const handleRequestPromises: Array<Promise<void>> = [];
    for (const pastInteraction of pastInteractionRequests) {
      handleRequestPromises.push(this.handleExpiredRequest(pastInteraction));
    }
    await Promise.all(handleRequestPromises);
  }

  private calculatePastDate(): Date {
    return new Date(Date.now() - Settings.EXPIRATION_REQUEST_TIME);
  }

  private async findPastInProgressRequests(
    pastDate: Date,
  ): Promise<InteractionRequest[]> {
    return this.interactionRequestModel.find({
      status: InteractionRequestStatus.IN_PROGRESS,
      createdAt: { $lt: pastDate },
    });
  }

  private async handleExpiredRequest(
    pastInteraction: InteractionRequest,
  ): Promise<void> {
    this.messageBroker.send(
      new InteractionExpiredRequest(
        new MessageRecipient()
          .add(pastInteraction.coach._id.toString())
          .add(pastInteraction.user._id.toString()),
        pastInteraction._id,
      ),
    );

    await this.interactionRequestStatus.updateStatus(
      pastInteraction,
      InteractionRequestStatus.EXPIRED,
    );
  }

  private isSelfInitiatedChatCheck(coach: string, user: string): void {
    if (coach === user)
      throw new BadRequestException('User attempts to start chat with himself');
  }

  private async isInsufficientFundsCheck(user: string) {
    const userBalance = await this.tokenTransactionService.getUserBalance(user);

    if (userBalance < Settings.INTERACTION_TOKEN_INIT_COUNT) {
      throw new BadRequestException(
        'User has insufficient funds to start a chat',
      );
    }
  }
}
