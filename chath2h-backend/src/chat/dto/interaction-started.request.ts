import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionStartedRequest extends SocketRequestBase {
  constructor(
    recipient: MessageRecipient,
    interactionId: string,
    interactionStartDate: Date,
  ) {
    super(recipient);
    this.interactionId = interactionId;
    this.interactionStartDate = interactionStartDate;
  }
  @IsString()
  @IsNotEmpty()
  interactionId: string;
  @IsDate()
  @IsNotEmpty()
  interactionStartDate: Date;
}
