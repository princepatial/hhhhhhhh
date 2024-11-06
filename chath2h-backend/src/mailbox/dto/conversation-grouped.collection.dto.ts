import { Conversation } from '../entities/conversation.entity';
import { ConversationGrouped } from './conversation-grouped.dto';

export class ConversationGroupedCollection extends Array<ConversationGrouped> {
  constructor(items?: ConversationGrouped[]) {
    super(...(items || []));
  }

  public add(currentUser: string, conversation: Conversation) {
    const recipient =
      conversation.participant1._id.toString() == currentUser
        ? conversation.participant2
        : conversation.participant1;
    let recpientConversation = this.find(
      (c) => c.recipient._id.toString() == recipient._id.toString(),
    );
    if (recpientConversation) {
      recpientConversation.conversations.push(conversation);
    } else {
      recpientConversation = new ConversationGrouped(recipient, [conversation]);
      this.push(recpientConversation);
    }
  }
}
