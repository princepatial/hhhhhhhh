import { IsNumber } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export class MailboxUnreadMessagesRequest extends SocketRequestBase {
  constructor(recipient: MessageRecipient, count: number) {
    super(recipient);
    this.count = count;
  }
  @IsNumber()
  count: number;
}
