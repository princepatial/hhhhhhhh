import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParticipantStatusService } from 'src/chat/services/participant-status.service';
import MessageBrokerService from 'src/communication/broker/broker.service';
import { MailboxMagicLinkService } from 'src/magic-link-creator/mailbox-magic-link.service';
import { MailService } from 'src/mail/mail.service';
import { TemplatesService } from 'src/mailTemplates/templates.service';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';
import { Message, MessageSchema } from './entities/message.entity';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    UsersModule,
  ],
  controllers: [MailboxController],
  providers: [
    MailboxService,
    MailService,
    TemplatesService,
    MessageBrokerService,
    ParticipantStatusService,
    MailboxMagicLinkService,
  ],
  exports: [MailboxService],
})
export class MailboxModule {}
