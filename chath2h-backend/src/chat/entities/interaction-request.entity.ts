import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { Conversation } from 'src/mailbox/entities/conversation.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';
import { User } from 'src/users/entities/user.entity';
import { InteractionRequestStatus } from '../dto/interaction-request-status.enum';

@Schema({ timestamps: true })
export class InteractionRequest extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  initiator: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  coach: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'NeedOffer',
    required: false,
  })
  need: NeedOffer;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'CoachOffer',
    required: false,
  })
  coachOffer: CoachOffer;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Conversation',
    required: false,
  })
  conversation: Conversation;

  @Prop({
    type: String,
    enum: InteractionRequestStatus,
    required: false,
    default: InteractionRequestStatus.IN_PROGRESS,
  })
  status: InteractionRequestStatus;
  readonly _id: string;
}

export const InteractionRequestSchema =
  SchemaFactory.createForClass(InteractionRequest);
