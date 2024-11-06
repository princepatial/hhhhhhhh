import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';
import { User } from 'src/users/entities/user.entity';
import { InteractionStatus } from '../dto/interaction-status.enum';
import { TokenTransaction } from 'src/tokenTransaction/entities/token-transaction';
import { InteractionOnchainTokenTransferStatus } from '../dto/interaction-onchain-token-transfer-status.enum';

@Schema({ timestamps: true })
export class Interaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, required: false })
  userSocket: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  coach: User;

  @Prop({ type: String, required: false })
  coachSocket: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'NeedOffer',
  })
  need: NeedOffer;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CoachOffer' })
  coachOffer: CoachOffer;

  @Prop({
    type: String,
    enum: InteractionStatus,
    required: true,
    default: InteractionStatus.STARTED,
  })
  status: InteractionStatus;

  @Prop({
    type: String,
    enum: InteractionOnchainTokenTransferStatus,
    required: true,
    default: InteractionOnchainTokenTransferStatus.NOT_SENT,
  })
  onchainTokenStatus: InteractionOnchainTokenTransferStatus;

  @Prop({ type: Map, of: String, default: {} })
  pausedBy: Map<string, string>;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'TokenTransaction',
    required: false,
  })
  transaction: TokenTransaction;

  //minutes
  @Prop({ type: Number, default: 0 })
  chatDuration: number;

  @Prop({ type: Number })
  rate: number;

  readonly createdAt: Date;
  readonly _id: string;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
