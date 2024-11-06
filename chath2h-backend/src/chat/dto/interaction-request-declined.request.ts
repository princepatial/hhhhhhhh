import { IsNotEmpty, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionRequestDeclinedRequest extends SocketRequestBase {
  constructor(recipient: MessageRecipient, interactionRequestId: string) {
    super(recipient);
    this.interactionRequestId = interactionRequestId;
  }
  @IsString()
  @IsNotEmpty()
  interactionRequestId: string;
}
