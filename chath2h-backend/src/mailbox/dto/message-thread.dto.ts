import { MessageDto } from './message.dto';

export class MessageThread {
  constructor(recipientId: string, messages: MessageDto[]) {
    this.messages = messages;
    this.recipientId = recipientId;
  }
  recipientId: string;
  messages: MessageDto[];
}
