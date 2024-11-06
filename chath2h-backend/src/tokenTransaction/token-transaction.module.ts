import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { TokenTransactionService } from './token-transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TokenTransaction,
  TokenTransactionSchema,
} from './entities/token-transaction';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { TokenTransactionController } from './token-transaction.controller';
import { CommunicationModule } from 'src/communication/communication.module';
import MessageBrokerService from 'src/communication/broker/broker.service';
import { Interaction, InteractionSchema } from 'src/chat/entities/interaction.entity';
import { Payment, PaymentSchema } from 'src/payment/entities/payment.entity';
import { TokenTransactionOnchainService } from './token-transaction-onchain.service';
import OnchainTransactionsWatcher from './watchers/onchain-transactions.watcher';
import { RunnableTaskModule } from 'src/runnableTask/runnable-task.module';
import { RunnableTask } from 'src/runnableTask/runnable-task';
import WatchersBundle from 'src/chat/watchers/watchers.boundle';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenTransaction.name, schema: TokenTransactionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    UsersModule,
    CommunicationModule,
    RunnableTaskModule,
  ],
  providers: [
    TokenTransactionService,
    MessageBrokerService,
    TokenTransactionService,
    TokenTransactionOnchainService,
    OnchainTransactionsWatcher,
    RunnableTask,
    WatchersBundle,
    {
      provide: WatchersBundle.WATHERS_BUNDLE_KEY,
      useFactory: (
        onchainTransactionsWatcher: OnchainTransactionsWatcher,
      ) => [onchainTransactionsWatcher],
      inject: [OnchainTransactionsWatcher],
    },
  ],
  exports: [TokenTransactionService, TokenTransactionOnchainService, WatchersBundle],
  controllers: [TokenTransactionController],
})
export class TokenTransactionModule {}
