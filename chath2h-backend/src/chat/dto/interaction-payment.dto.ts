import { IsNotEmpty, IsString } from 'class-validator';

export default class InteractionPaymentDto {
  userId: string;
  @IsString()
  @IsNotEmpty()
  interactionId: string;
}
