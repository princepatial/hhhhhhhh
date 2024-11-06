import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  from: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  to: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 400 })
  content: string;

  @Prop({ type: Boolean, required: false, default: false })
  viewed: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  systemMessage: boolean;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
