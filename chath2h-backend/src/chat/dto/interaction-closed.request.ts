import { IsNotEmpty, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionClosedRequest extends SocketRequestBase {
  constructor(
    recipient: MessageRecipient,
    interactionId: string,
    user: string,
  ) {
    super(recipient);
    this.user = user;
    this.interactionId = interactionId;
  }
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  interactionId: string;
}
