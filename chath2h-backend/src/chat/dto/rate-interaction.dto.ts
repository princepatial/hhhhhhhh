import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export default class RateInteractionDto {
  initiator: ObjectId;

  @IsNotEmpty()
  @IsString()
  interactionId: string;

  @IsNumber()
  rate: number;
}
