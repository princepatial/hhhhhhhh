import { User } from 'src/users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TokenTransactionType } from './token-transaction-type';
import { TokenTransactionStatus } from './token-transaction-status';
import { TokenTransactionFee } from './token-transaction-fee';
@Schema({ timestamps: true })
export class TokenTransaction extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  sender?: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  recipient: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  owner: User;

  @Prop({
    type: String,
    enum: Object.values(TokenTransactionType),
  })
  type: TokenTransactionType;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: Number })
  freeAmount: number;

  @Prop({ type: Number, required: false, default: 0 })
  feeAmount: number;

  @Prop({
    type: String,
    enum: Object.values(TokenTransactionFee),
    required: true
  })
  fee: TokenTransactionFee

  @Prop({
    type: String,
    enum: Object.values(TokenTransactionStatus),
    default: TokenTransactionStatus.SUCCEDED
  })
  status: TokenTransactionStatus

  @Prop({ type: Boolean, required:false, default: false })
  tokensTransferred: Boolean;

  @Prop({ type: String, required:false })
  errorMessage: String;

  @Prop({ type: Boolean, default: false })
  tokensTransferredOnchain: boolean;

  readonly createdAt: Date;
}

export const TokenTransactionSchema =
  SchemaFactory.createForClass(TokenTransaction);
