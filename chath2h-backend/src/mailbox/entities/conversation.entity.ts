import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Message } from './message.entity';
import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';

@Schema({ timestamps: true })
export class Conversation extends Document {
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
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }],
  })
  messages: Message[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  participant1: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  participant2: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  owner: User;

  readonly updatedAt: Date;

  @Prop({ type: Number })
  messagesLimit: number;

  @Prop({ type: Number })
  messagesCount: number;

  @Prop({ type: Map, of: Number, default: {} })
  participantsLimits: Map<string, number>;

  @Prop({ type: Number, required: false })
  messagesNotViewed: number;

  @Prop({ type: Number, required: false })
  userMessageLimit: number;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.set('toJSON', { virtuals: true });
ConversationSchema.set('toObject', { virtuals: true });
