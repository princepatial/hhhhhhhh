import { Injectable } from '@nestjs/common';
import ChatMessageService from 'src/chat/services/chat-message.service';
import InteractionService from 'src/chat/services/interaction.service';

@Injectable()
export class UserInteractionsService {
  constructor(
    private readonly interactionService: InteractionService,
    private readonly chatMessageService: ChatMessageService,
  ) {}

  findAllNeedOfferInteractions(user: string, needOrOffer: string) {
    return this.interactionService.getNeedOfferWithInteractions(
      needOrOffer,
      user,
    );
  }

  findNeedConversation(needOffer: string, user: string, recipient: string) {
    return this.chatMessageService.getMessages(needOffer, user, recipient);
  }

  findUserInteractions(user: string) {
    return this.interactionService.getUserInteractions(user);
  }
}
