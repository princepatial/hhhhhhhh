import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionTimeRequest extends SocketRequestBase {
  constructor(
    recipient: MessageRecipient,
    interactionId: string,
    duration: number
  ) {
    super(recipient);
    this.duration = duration;
    this.interactionId = interactionId;
  }

  @IsString()
  @IsNotEmpty()
  interactionId: string;
  @IsNumber()
  @IsPositive()
  duration: number;
}
