import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { TemplatesService } from './mailTemplates/templates.service';
import { ChatModule } from './gateway/chat.module';
import { Settings } from './settings';
import { AreasModule } from './areas/areas.module';
import { CoachOfferModule } from './coach-offer/coach-offer.module';
import { NeedsModule } from './needs/needs.module';
import { AdsModule } from './ads/ads.module';
import * as paginate from 'mongoose-paginate-v2';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoachesModule } from './coaches/coaches.module';
import { MailboxModule } from './mailbox/mailbox.module';
import { FilesModule } from './files/files.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TokenTransactionModule } from './tokenTransaction/token-transaction.module';
import { CommunicationModule } from './communication/communication.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RunnableTaskModule } from './runnableTask/runnable-task.module';
import { ChatModule as InteractionModule } from './chat/chat.module';
import { PlatformStatisticModule } from './platform-statistic/platform-statistic.module';
import * as path from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { UserInteractionsModule } from './user-interactions/user-interactions.module';
import { PaymentModule } from './payment/payment.module';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      viewEngine: 'hbs',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['lang'])],
    }),
    UsersModule,
    MongooseModule.forRoot(
      `mongodb://${Settings.DB_HOST}:${Settings.DB_PORT}/${Settings.DB_NAME}`,
      {
        connectionFactory: (connection) => {
          connection.plugin(paginate);
          return connection;
        },
      },
    ),
    AuthModule,
    ChatModule,
    TokenTransactionModule,
    AreasModule,
    CoachOfferModule,
    NeedsModule,
    AdsModule,
    DashboardModule,
    CoachesModule,
    MailboxModule,
    FilesModule,
    PlatformStatisticModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CommunicationModule,
    ScheduleModule.forRoot(),
    RunnableTaskModule,
    InteractionModule,
    UserInteractionsModule,
    PaymentModule,
    TranslationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TemplatesService,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
