import { User } from 'src/users/entities/user.entity';
import { Conversation } from '../entities/conversation.entity';
import { IsNotEmptyObject } from 'class-validator';

export class ConversationGrouped {
  constructor(recipient: User, conversations: Conversation[]) {
    this.recipient = recipient;
    this.conversations = conversations;
  }

  @IsNotEmptyObject()
  recipient: User;
  @IsNotEmptyObject()
  conversations: Conversation[];
}
