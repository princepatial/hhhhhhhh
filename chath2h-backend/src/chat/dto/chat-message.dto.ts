import { IsNotEmpty, IsString } from 'class-validator';

export default class ChatMessageDto {
  constructor(
    to: string,
    interactionId: string,
    content: string,
    from: string,
  ) {
    this.interactionId = interactionId;
    this.from = from;
    this.content = content;
    this.to = to;
  }

  @IsString()
  @IsNotEmpty()
  interactionId: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
