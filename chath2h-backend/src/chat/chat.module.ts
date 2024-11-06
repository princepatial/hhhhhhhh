import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

import { CoachOfferModule } from 'src/coach-offer/coach-offer.module';
import MessageBrokerService from 'src/communication/broker/broker.service';
import { CommunicationModule } from 'src/communication/communication.module';
import { Message, MessageSchema } from 'src/mailbox/entities/message.entity';
import { MailboxModule } from 'src/mailbox/mailbox.module';
import { NeedsModule } from 'src/needs/needs.module';
import { RunnableTask } from 'src/runnableTask/runnable-task';
import { RunnableTaskModule } from 'src/runnableTask/runnable-task.module';
import { TokenTransactionModule } from 'src/tokenTransaction/token-transaction.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { ChatRequestController } from './chat-request.controller';
import { ChatController } from './chat.controller';
import { ChatMessage, ChatMessageSchema } from './entities/chat-message.entity';
import {
  InteractionRequest,
  InteractionRequestSchema,
} from './entities/interaction-request.entity';
import { Interaction, InteractionSchema } from './entities/interaction.entity';
import ChatMessageService from './services/chat-message.service';
import { InteractionRequestStatusService } from './services/interaction-request-status.service';
import InteractionRequestService from './services/interaction-request.service';
import InteractionService from './services/interaction.service';
import InteractionTimeExpired from './watchers/Interaction-time-expired.watcher';
import InteractionTimeWatcher from './watchers/interaction-time.watcher';
import WatchersBundle from './watchers/watchers.boundle';
import TokenTransactionTransferWatcher from './watchers/token-transaction-transfer.watcher';
import TokenTransactionOutdatedFreeTokensWatcher from './watchers/token-transaction-outdated-free-tokens.watcher';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    MongooseModule.forFeature([
      { name: InteractionRequest.name, schema: InteractionRequestSchema },
    ]),
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UsersModule,
    RunnableTaskModule,
    CommunicationModule,
    MailboxModule,
    TokenTransactionModule,
    NeedsModule,
    CoachOfferModule,
  ],
  providers: [
    Logger,
    InteractionService,
    InteractionRequestService,
    RunnableTask,
    MessageBrokerService,
    WatchersBundle,
    InteractionTimeWatcher,
    InteractionTimeExpired,
    InteractionRequestService,
    InteractionRequestStatusService,
    ChatMessageService,
    TokenTransactionTransferWatcher,
    TokenTransactionOutdatedFreeTokensWatcher,
    {
      provide: WatchersBundle.WATHERS_BUNDLE_KEY,
      useFactory: (
        interactionWatcher: InteractionTimeWatcher,
        interactionTimeExpiredWatcher: InteractionTimeExpired,
        tokenTransactionTransferWatcher: TokenTransactionTransferWatcher,
        tokenTransactionOutdatedFreeTokensWatcher: TokenTransactionOutdatedFreeTokensWatcher
      ) => [interactionWatcher, interactionTimeExpiredWatcher, tokenTransactionTransferWatcher, tokenTransactionOutdatedFreeTokensWatcher],
      inject: [InteractionTimeWatcher, InteractionTimeExpired, TokenTransactionTransferWatcher, TokenTransactionOutdatedFreeTokensWatcher],
    },
  ],
  exports: [
    InteractionService,
    WatchersBundle,
    ChatMessageService,
    InteractionRequestService,
  ],
  controllers: [ChatRequestController, ChatController],
})
export class ChatModule {}
