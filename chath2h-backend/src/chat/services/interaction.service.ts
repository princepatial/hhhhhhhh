import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId as ObjId } from 'mongodb';
import { Model, ObjectId } from 'mongoose';
import { CoachOfferService } from 'src/coach-offer/coach-offer.service';
import MessageBrokerService from 'src/communication/broker/broker.service';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { NeedsService } from 'src/needs/needs.service';
import { Settings } from 'src/settings';
import { TokenTransactionFee } from 'src/tokenTransaction/entities/token-transaction-fee';
import { TokenTransactionStatus } from 'src/tokenTransaction/entities/token-transaction-status';
import { TokenTransactionType } from 'src/tokenTransaction/entities/token-transaction-type';
import { TokenTransactionService } from 'src/tokenTransaction/token-transaction.service';
import { UsersService } from 'src/users/users.service';
import FinishInteractionDto from '../dto/finishInteraction.dto';
import InteractionClosedRequest from '../dto/interaction-closed.request';
import InteractionFinishedRequest from '../dto/interaction-finished-request.dto';
import InteractionInitiatedRequest from '../dto/interaction-initiated.request';
import InteractionPausedRequest from '../dto/interaction-paused-request.dto';
import InteractionPaymentDto from '../dto/interaction-payment.dto';
import InteractionRecipientOffers from '../dto/interaction-recipient-offers';
import InteractionRejoinedRequest from '../dto/interaction-rejoined-request.dto';
import InteractionRequestUser from '../dto/interaction-request-user.dto';
import InteractionResumedRequest from '../dto/interaction-resumed-reuqest.dto';
import InteractionUserSocket from '../dto/interaction-socket.dto ';
import InteractionStartedRequest from '../dto/interaction-started.request';
import { InteractionStatus } from '../dto/interaction-status.enum';
import { InteractionDto } from '../dto/interaction.dto';
import NeedOfferInteractions from '../dto/needoffer-with-interactions';
import RateInteractionDto from '../dto/rate-interaction.dto';
import updateInteractionTimeDto from '../dto/update-interaction-time.dto';
import UserBalanceRequest from '../dto/user-balance.request';
import { InteractionRequest } from '../entities/interaction-request.entity';
import { Interaction } from '../entities/interaction.entity';

@Injectable()
export default class InteractionService {
  constructor(
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<Interaction>,
    private readonly messageBroker: MessageBrokerService,
    private readonly tokenTransactionService: TokenTransactionService,
    private readonly mailboxService: MailboxService,
    private readonly needsService: NeedsService,
    private readonly coachOffersService: CoachOfferService,
    private readonly userService: UsersService,
  ) {}

  public async updateInteractionDuration({
    interactionId,
    chatDuration,
    user,
  }: updateInteractionTimeDto & { user: string }) {
    await this.interactionModel.updateOne(
      { _id: interactionId, $or: [{ user }, { coach: user }] },
      { $inc: { chatDuration } },
    );
  }

  public async getInteraction(interactionId: string, user: string) {
    const {
      transaction: { amount },
      chatDuration,
      coach,
    } = await this.interactionModel
      .findOne({ _id: interactionId, $or: [{ user }, { coach: user }] })
      .populate('transaction')
      .lean();
    const fee =
      coach.toString() === user.toString()
        ? this.tokenTransactionService.calculateFee(amount)
        : 0;
    return { amount: amount - fee, chatDuration };
  }

  public async getNeedOfferWithInteractions(
    needOrOffer: string,
    user: string,
  ): Promise<NeedOfferInteractions> {
    const need = await this.needsService.getNeedById(needOrOffer);
    let coachOffer;
    if (!need) {
      coachOffer = await this.coachOffersService.getOfferById(needOrOffer);
      if (!coachOffer) {
        const error = `Need or offer not found`;
        console.error(error);
        throw new BadRequestException(error);
      }
    }
    const result: NeedOfferInteractions = {
      needOffer: need?.toObject() || coachOffer?.toObject(),
      interactionRecipients: [],
    };
    delete result.needOffer.user;
    const offerId = new ObjId(needOrOffer);
    const userId = new ObjId(user);
    const interactions = await this.interactionModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [{ need: offerId }, { coachOffer: offerId }],
            },
            { $or: [{ coach: userId }, { user: userId }] },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'users',
          localField: 'coach',
          foreignField: '_id',
          as: 'coach',
        },
      },
      { $unwind: '$coach' },
      {
        $lookup: {
          from: 'files',
          localField: 'user.avatar',
          foreignField: '_id',
          as: 'user.avatar',
        },
      },
      { $unwind: '$user.avatar' },
      {
        $lookup: {
          from: 'files',
          localField: 'coach.avatar',
          foreignField: '_id',
          as: 'coach.avatar',
        },
      },
      { $unwind: '$coach.avatar' },
      { $sort: { updatedAt: -1 } },
    ]);
    const tempRecipients: Record<string, any> = {};
    interactions.forEach((recipientWithInteractions) => {
      const { user: interactionUser, coach: interactionCoach } =
        recipientWithInteractions;
      const recipient =
        interactionUser._id.toString() !== user
          ? interactionUser
          : interactionCoach;
      const { _id, firstName, lastName, avatar } = recipient;
      const recipientId = _id.toString();
      const recipientDto = {
        _id,
        firstName,
        lastName,
        avatar: avatar.filename,
        updatedAt: recipientWithInteractions.updatedAt,
      };
      if (!tempRecipients[recipientId])
        tempRecipients[recipientId] = recipientDto;
    });
    result.interactionRecipients.push(...Object.values(tempRecipients));
    return result;
  }

  //TODO: need optimization
  public async getUserInteractions(
    user: string,
  ): Promise<InteractionRecipientOffers[]> {
    const userId = new ObjId(user);
    const interactions = await this.interactionModel.aggregate([
      {
        $match: {
          $or: [{ coach: userId }, { user: userId }],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'users',
          localField: 'coach',
          foreignField: '_id',
          as: 'coach',
        },
      },
      { $unwind: '$coach' },
      {
        $lookup: {
          from: 'files',
          localField: 'user.avatar',
          foreignField: '_id',
          as: 'user.avatar',
        },
      },
      { $unwind: '$user.avatar' },
      {
        $lookup: {
          from: 'files',
          localField: 'coach.avatar',
          foreignField: '_id',
          as: 'coach.avatar',
        },
      },
      { $unwind: '$coach.avatar' },
      {
        $lookup: {
          from: 'coachoffers',
          localField: 'coachOffer',
          foreignField: '_id',
          as: 'coachOffer',
        },
      },
      { $unwind: { path: '$coachOffer', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'needoffers',
          localField: 'need',
          foreignField: '_id',
          as: 'need',
        },
      },
      { $unwind: { path: '$need', preserveNullAndEmptyArrays: true } },
      { $sort: { updatedAt: -1 } },
    ]);
    const tempInteractions: Record<string, InteractionRecipientOffers> = {};
    interactions.forEach((recipientWithInteractions) => {
      const {
        user: interactionUser,
        coach: interactionCoach,
        need,
        coachOffer,
      } = recipientWithInteractions;

      const recipient =
        interactionUser._id.toString() !== user
          ? interactionUser
          : interactionCoach;
      const needOffer = need || coachOffer;
      if (!needOffer) return;
      const needOfferId = needOffer._id.toString();
      const { _id, firstName, lastName, avatar } = recipient;
      const recipientId = _id.toString();
      const recipientDto = {
        _id: recipientId,
        firstName,
        lastName,
        avatar: avatar.filename,
        updatedAt: recipientWithInteractions.updatedAt,
      };
      const existingInteraction = tempInteractions[recipientId];
      if (!existingInteraction) {
        tempInteractions[recipientId] = {
          interactionRecipient: recipientDto,
          needOffers: [needOffer],
        };
      } else {
        const existingRecipientIndex = existingInteraction.needOffers.findIndex(
          (offer) => {
            return offer._id.toString() === needOfferId;
          },
        );
        if (existingRecipientIndex < 0) {
          existingInteraction.needOffers.push(needOffer);
        }
      }
    });
    const result: InteractionRecipientOffers[] =
      Object.values(tempInteractions);
    return result;
  }

  async pauseInteraction(userSocket: InteractionUserSocket) {
    const interaction = await this.interactionModel
      .findById(userSocket.interactionId)
      .populate('user coach');
    let initiatorName;
    if (interaction) {
      if (userSocket.user == interaction.user._id.toString()) {
        interaction.pausedBy.set('user', userSocket.user);
        initiatorName = interaction.user.firstName;
      } else {
        interaction.pausedBy.set('coach', userSocket.user);
        initiatorName = interaction.coach.firstName;
      }
      interaction.status = InteractionStatus.PAUSED;
      this.messageBroker.send(
        new InteractionPausedRequest(
          new MessageRecipient()
            .add(interaction.coach._id.toString())
            .add(interaction.user._id.toString()),
          interaction._id.toString(),
          userSocket.socketId,
          initiatorName,
        ),
      );
      await interaction.save();
    }
  }

  async preFinishInteraction(userSocket: InteractionUserSocket) {
    const interaction = await this.interactionModel
      .findById(userSocket.interactionId)
      .populate('user coach');
    let initiatorName;
    if (interaction) {
      if (userSocket.user == interaction.user._id.toString()) {
        interaction.pausedBy.set('user', userSocket.user);
        initiatorName = interaction.user.firstName;
      } else {
        interaction.pausedBy.set('coach', userSocket.user);
        initiatorName = interaction.coach.firstName;
      }
      if (interaction.pausedBy.size == 2) {
        interaction.status = InteractionStatus.PAUSED;
        this.messageBroker.send(
          new InteractionPausedRequest(
            new MessageRecipient()
              .add(interaction.coach._id.toString())
              .add(interaction.user._id.toString()),
            interaction._id.toString(),
            userSocket.socketId,
            initiatorName,
          ),
        );
      }
      await interaction.save();
    }
  }

  async resumeInteraction(userSocket: InteractionUserSocket) {
    const interaction = await this.interactionModel.findById(
      userSocket.interactionId,
    );
    if (interaction) {
      interaction.pausedBy.clear();
      if (!interaction.pausedBy.size) {
        interaction.status = InteractionStatus.IN_PROGRESS;
        this.messageBroker.send(
          new InteractionResumedRequest(
            new MessageRecipient()
              .addWithSocket(
                interaction.user._id.toString(),
                interaction.userSocket,
              )
              .addWithSocket(
                interaction.coach._id.toString(),
                interaction.coachSocket,
              ),
          ),
        );
      }
      await interaction.save();
    }
  }

  public getInProgress(): Promise<Interaction[]> {
    return this.interactionModel.find({
      status: InteractionStatus.IN_PROGRESS,
    });
  }

  public getInteractionInProgress(interactionId: string): Promise<Interaction> {
    return this.interactionModel.findOne({
      _id: interactionId,
      status: InteractionStatus.IN_PROGRESS,
    });
  }

  public async initInteraction(
    interactionRequest: InteractionRequest,
    interactionRequestUser: InteractionRequestUser,
  ) {
    const interactionDto: InteractionDto =
      this.toInteraction(interactionRequest);

    const { user, socketId } = interactionRequestUser;

    const usersInChat = await this.userService.checkIsInChat([
      interactionDto.user,
      interactionDto.coach,
    ]);

    if (usersInChat) {
      const error = 'You cannot start chat, user is in chat.';

      throw new BadRequestException(error);
    }

    const [interaction] = await Promise.all([
      this.interactionModel.create({
        ...interactionDto,
        status: InteractionStatus.STARTED,
      }),
      this.userService.updateIsInChat(
        [interactionDto.user.toString(), interactionDto.coach.toString()],
        true,
      ),
    ]);

    await this.joinInteraction(
      new InteractionUserSocket(user, socketId, interaction._id.toString()),
    );

    this.messageBroker.send(
      new InteractionInitiatedRequest(
        new MessageRecipient()
          .add(interaction.coach._id.toString())
          .add(interaction.user._id.toString()),
        interaction._id.toString(),
      ),
    );
  }

  public async rejoinInteraction(userSocket: InteractionUserSocket) {
    const interaction = await this.interactionModel.findById(
      userSocket.interactionId,
    );
    if (userSocket.user == interaction.user._id.toString()) {
      interaction.pausedBy.delete('user');
    } else {
      interaction.pausedBy.delete('coach');
    }
    await interaction.save();
    this.messageBroker.send(
      new InteractionRejoinedRequest(
        new MessageRecipient().addWithSocket(
          userSocket.user,
          userSocket.socketId,
        ),
      ),
    );
    if (interaction.pausedBy.size === 0) this.joinInteraction(userSocket);
  }

  /*
    This function should be calles by websocket call from frontend after user accept invitation (interaction request)
     */
  public async joinInteraction(userSocket: InteractionUserSocket) {
    const interaction = await this.interactionModel.findById(
      userSocket.interactionId,
    );
    const userId = interaction.user._id.toString();
    const coachId = interaction.coach._id.toString();
    const needOfferId =
      interaction.coachOffer?._id.toString() ||
      interaction.need?._id.toString();
    if (userSocket.user == userId) {
      interaction.userSocket = userSocket.socketId;
    } else {
      interaction.coachSocket = userSocket.socketId;
    }
    if (interaction.coachSocket && interaction.userSocket) {
      //both parties joined chat
      interaction.status = InteractionStatus.IN_PROGRESS;
      this.mailboxService.findAndClearConversationLimit(
        needOfferId,
        userId,
        coachId,
      );
      this.messageBroker.send(
        new InteractionStartedRequest(
          new MessageRecipient()
            .addWithSocket(coachId, interaction.coachSocket)
            .addWithSocket(userId, interaction.userSocket),
          interaction.id,
          new Date(),
        ),
      );
    }
    interaction.save();
  }

  public async leaveInteraction(interactionUser: InteractionUserSocket) {
    const { user, socketId, interactionId } = interactionUser;

    const interaction = await this.interactionModel.findOneAndUpdate(
      {
        $or: [
          {
            $and: [{ user }, { userSocket: socketId }],
          },
          {
            $and: [{ coach: user }, { coachSocket: socketId }],
          },
        ],
      },
      { status: InteractionStatus.FINISHED },
      { new: true },
    );
    await Promise.all([
      this.userService.updateIsInChat([
        interaction.user._id.toString(),
        interaction.coach._id.toString(),
      ]),
      this.tokenTransactionService.setToTransfer(
        interaction.transaction._id.toString(),
      ),
    ]);

    this.messageBroker.send(
      new InteractionClosedRequest(
        new MessageRecipient()
          .addWithSocket(
            interaction.user._id.toString(),
            interaction.userSocket,
          )
          .addWithSocket(
            interaction.coach._id.toString(),
            interaction.coachSocket,
          ),
        interactionId,
        user,
      ),
    );
  }

  public async finishInteraction(interaction: FinishInteractionDto) {
    const existingInteraction = await this.interactionModel.findOne({
      _id: interaction.interactionId,
    });

    if (!existingInteraction)
      throw new HttpException('Interaction not found', HttpStatus.BAD_REQUEST);

    this.userInInteractionCheck(existingInteraction, interaction.initiator);
    existingInteraction.status = InteractionStatus.FINISHED;
    console.log("finishInteraction");

    await Promise.all([
      existingInteraction.save(),
      this.userService.updateIsInChat([
        existingInteraction.user._id.toString(),
        existingInteraction.coach._id.toString(),
      ]),
      this.tokenTransactionService.setToTransfer(
        existingInteraction.transaction._id.toString(),
      ),
    ]);

    this.messageBroker.send(
      new InteractionFinishedRequest(
        new MessageRecipient()
          .addWithSocket(
            existingInteraction.user._id.toString(),
            existingInteraction.userSocket,
          )
          .addWithSocket(
            existingInteraction.coach._id.toString(),
            existingInteraction.coachSocket,
          ),
        existingInteraction._id,
      ),
    );
  }

  public async interactionPayment(interactionPayment: InteractionPaymentDto) {
    const { userId, interactionId } = interactionPayment;
    const amount = Settings.INTERACTION_MINUTE_COST;
    const interaction = await this.interactionModel.findById(interactionId);
    if (!interaction) {
      throw new BadRequestException(
        'Interaction does not exist: ' + interactionPayment.interactionId,
      );
    }

    if (interaction.status !== InteractionStatus.IN_PROGRESS) return;

    const recipient =
      userId.toString() === interaction.coach._id.toString()
        ? interaction.user._id
        : interaction.coach._id;

    if (!interaction?.transaction) {
      const transaction = await this.tokenTransactionService.createTransaction({
        sender: userId,
        recipient: recipient,
        amount: 0,
        type: TokenTransactionType.CHAT,
        status: TokenTransactionStatus.OPEN, // transaction is open, amount will be increased during of chat
        fee: TokenTransactionFee.ENABLED,
      });

      interaction.transaction = transaction._id;
      await interaction.save();
    } 

    await this.tokenTransactionService.increaseTransactionAmount({
      id: interaction.transaction._id,
      sender: userId,
      recipient: recipient,
      amount: amount,
      type: TokenTransactionType.CHAT
    });
    

    const balances: Record<string, number> = {
      [interaction.user._id.toString()]:
        await this.tokenTransactionService.getUserBalance(
          interaction.user._id.toString(),
        ),
    };

    const balancesRequest: UserBalanceRequest = new UserBalanceRequest(
      new MessageRecipient().add(interaction.user._id.toString()),
      balances,
    );
    this.messageBroker.send(balancesRequest);
  }

  private toInteraction(
    interactionRequest: InteractionRequest,
  ): InteractionDto {
    const interaction: InteractionDto = new InteractionDto({
      user: interactionRequest.user._id,
      coach: interactionRequest.coach._id,
      coachOffer: interactionRequest.coachOffer?._id,
      need: interactionRequest.need?._id,
    });
    return interaction;
  }

  private userInInteractionCheck(
    interaction: Interaction,
    initiator: ObjectId,
  ) {
    if (
      interaction.user._id.toString() !== initiator.toString() &&
      interaction.coach._id.toString() !== initiator.toString()
    ) {
      throw new BadRequestException(
        'Could not finish interaction with requested user',
      );
    }
  }

  public async rateInteraction({
    interactionId,
    rate,
    initiator,
  }: RateInteractionDto) {
    const existingInteraction = await this.interactionModel.findOne({
      _id: interactionId,
    });

    if (!existingInteraction)
      throw new HttpException('Interaction not found', HttpStatus.BAD_REQUEST);

    if (existingInteraction.status !== InteractionStatus.FINISHED) {
      throw new HttpException(
        'Interaction is not finished yet',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.userInInteractionCheck(existingInteraction, initiator);

    existingInteraction.rate = rate;
    existingInteraction.save();
  }
}
