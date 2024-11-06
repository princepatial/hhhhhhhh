import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionResumedRequest extends SocketRequestBase {
  constructor(recipient: MessageRecipient) {
    super(recipient);
  }
}
