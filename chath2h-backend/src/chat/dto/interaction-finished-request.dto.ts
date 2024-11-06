import { IsNotEmpty, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionFinishedRequest extends SocketRequestBase {
  constructor(recipient: MessageRecipient, interactionId: string) {
    super(recipient);
    this.interactionId = interactionId;
  }
  @IsString()
  @IsNotEmpty()
  interactionId: string;
}
