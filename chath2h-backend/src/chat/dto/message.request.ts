import { IsNotEmpty, IsString } from 'class-validator';
import SocketRequestBase from 'src/communication/transport/socket-request.base';
import ChatMessageDto from './chat-message.dto';
import { MessageRecipient } from 'src/communication/transport/message-recipient';

export default class MessageRequest extends SocketRequestBase {
  constructor(recipient: MessageRecipient, message: ChatMessageDto) {
    super(recipient);
    this.interactionId = message.interactionId;
    this.from = message.from;
    this.content = message.content;
  }

  @IsString()
  @IsNotEmpty()
  interactionId: string;

  @IsString()
  @IsNotEmpty()
  from: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
