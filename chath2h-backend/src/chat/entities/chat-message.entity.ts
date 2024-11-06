import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { Interaction } from './interaction.entity';

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  from: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  to: User;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Interaction',
    required: true,
  })
  interactionId: Interaction;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
