import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export default class FinishInteractionDto {
  initiator: ObjectId;
  @IsNotEmpty()
  @IsString()
  interactionId: string;
}
