import { Injectable } from '@nestjs/common';
import { BaseMagicLinkGenerator } from './base-magic-link-generator';
import { MailboxMagicLinkDto } from './mailbox-magic-link.dto';

@Injectable()
export class MailboxMagicLinkService extends BaseMagicLinkGenerator {
  constructor() {
    super();
  }

  public createMailboxMagicLink({
    recipient,
    redirectContext,
  }: MailboxMagicLinkDto) {
    const baseMagicLink = this.magicLinkCreate(recipient);
    const magicLink = baseMagicLink + `&redirectUri=` + redirectContext;

    return magicLink;
  }
}
