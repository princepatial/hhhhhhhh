import { Headers, Injectable, Logger, Req } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-magic-login';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { TemplatesService } from 'src/mailTemplates/templates.service';
import { Settings } from 'src/settings';
import { I18nContext, I18nService } from 'nestjs-i18n';

type VerifyCallback = (
  error: Error | null,
  user: { _id: string } | { email: string },
) => void;

@Injectable()
export class MagicLoginStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(MagicLoginStrategy.name);

  isUserWithId(user: User | { email: string }): user is User {
    return '_id' in user;
  }

  constructor(
    private authService: AuthService,
    private mailService: MailService,
    private templatesService: TemplatesService,
    private readonly i18n: I18nService,
  ) {
    super({
      secret: Settings.SECRET,
      callbackUrl: `/authorization`,
      sendMagicLink: async (destination: string, href: string) => {
        const template = this.templatesService.renderTemplate(
          'registrationConfirm',
          {
            url:
              Settings.FRONTEND_URL + '/' + I18nContext.current().lang + href,
            name: destination,
          },
        );
        try {
          await this.mailService.send({
            to: destination,
            subject: this.i18n.t('common.login-to-the-app', {
              lang: I18nContext.current().lang,
            }),
            html: template,
          });

          this.logger.debug(
            `sending email to ${destination} with link ${
              Settings.FRONTEND_URL + '/' + I18nContext.current().lang + href
            }`,
          );
        } catch (error) {
          console.error(`Error sending magic link to ${destination}: ${error}`);
        }
      },
      verify: async (
        payload: { destination: string },
        callback: VerifyCallback,
      ) => {
        callback(null, await this.validate(payload));
      },
      jwtOptions: {
        expiresIn: '1 days',
      },
    });
  }

  async validate(payload: { destination: string }) {
    const user = await this.authService.validateUser(payload.destination);
    if (!user) return { email: payload.destination };

    const { _id, admin, isDisabled, country } = user;

    return {
      _id,
      admin,
      isDisabled,
      country,
    };
  }
}
