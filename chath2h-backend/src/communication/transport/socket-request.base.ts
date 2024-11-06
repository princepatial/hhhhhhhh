import { MessageRecipient } from './message-recipient';
import { SocketRequestMessage } from './message.interfaces';

export default abstract class SocketRequestBase
  implements SocketRequestMessage
{
  channelPrefix = 'socket';
  channelPostfix = 'response';
  constructor(
    recipient: MessageRecipient,
  ) {
    this.recipient = recipient;
  }
  recipient: MessageRecipient;
}
