import { Injectable } from '@nestjs/common';
import { Settings } from 'src/settings';
import { sign } from 'jsonwebtoken';

@Injectable()
export class BaseMagicLinkGenerator {
  protected magicLinkCreate(recipient: string) {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    const token = sign(
      { destination: recipient, expiration: date },
      Settings.SECRET,
    );
    const magicLink = `${Settings.FRONTEND_URL}/authorization?token=${token}`;

    return magicLink;
  }
}
