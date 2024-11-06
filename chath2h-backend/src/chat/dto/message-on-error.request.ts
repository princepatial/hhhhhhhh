import { IsNotEmpty, IsString } from 'class-validator';
import SocketRequestBase from 'src/communication/transport/socket-request.base';
import ChatMessageDto from './chat-message.dto';
import { MessageRecipient } from 'src/communication/transport/message-recipient';

export default class MessageOnErrorRequest extends SocketRequestBase {
  constructor(message: ChatMessageDto) {
    super(new MessageRecipient().add(message.from.toString()));
    this.interactionId = message.interactionId;
  }

  @IsString()
  @IsNotEmpty()
  interactionId: string;
}
