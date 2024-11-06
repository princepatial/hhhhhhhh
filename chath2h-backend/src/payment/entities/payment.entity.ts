import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus } from './payment-status';
import { TokenTransaction } from 'src/tokenTransaction/entities/token-transaction';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  user: User;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
  })
  status: PaymentStatus;

  @Prop({ type: String })
  sessionId: string;
  @Prop({ type: String, required: true })
  uniqueId: string;
  @Prop({ type: String, required: false })
  meta: string;
  @Prop({ type: String, required: false })
  paymentId: string;
  @Prop({ type: Number, required: true })
  tokensQuantity: number;
  @Prop({ type: String, required: false })
  currency: string;
  @Prop({ type: Number, required: false })
  amountCents: number;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TokenTransaction', required: false })
  tokenTransaction: TokenTransaction;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
