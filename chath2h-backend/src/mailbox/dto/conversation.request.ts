import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { Message } from '../entities/message.entity';
import SocketRequestBase from 'src/communication/transport/socket-request.base';
import { MessageRecipient } from 'src/communication/transport/message-recipient';

export class ConversationRequest extends SocketRequestBase {
  constructor(conversationid: string, message: Message) {
    super(new MessageRecipient().add(message.to.toString()));
    this.conversationId = conversationid;
    this.message = message;
  }

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmptyObject()
  message: Message;
}
