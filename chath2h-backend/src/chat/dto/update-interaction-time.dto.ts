import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class updateInteractionTimeDto {
  @IsString()
  @IsNotEmpty()
  interactionId: string;
  @IsNumber()
  @IsNotEmpty()
  chatDuration: number;
}
