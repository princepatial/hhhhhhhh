import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MagicLoginStrategy } from './magiclogin.strategy';
import { SessionSerializer } from './session.serializer';
import { PassportModule } from '@nestjs/passport';
import { RegistrationController } from './registration.controller';
import { MailModule } from 'src/mail/mail.module';
import { TemplatesService } from 'src/mailTemplates/templates.service';
import { FilesModule } from 'src/files/files.module';
import { TokenTransactionModule } from 'src/tokenTransaction/token-transaction.module';
import { RefLinkService } from 'src/magic-link-creator/ref-magic-link';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    MailModule,
    TokenTransactionModule,
    FilesModule,
  ],
  controllers: [AuthController, RegistrationController],
  providers: [
    AuthService,
    MagicLoginStrategy,
    SessionSerializer,
    TemplatesService,
    RefLinkService,
    MailService
  ],
})
export class AuthModule {}