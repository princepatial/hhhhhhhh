import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { Settings } from 'src/settings';

@Injectable()
export class RefLinkService {
  public createRefMagicLink(reference: string) {
    const refToken = sign({ reference }, Settings.SECRET);
    const refLink = `${Settings.FRONTEND_URL}/register?refToken=${refToken}`;

    return refLink;
  }

  public decodeRefMagicLink(token: string) {
    const decoded = verify(token, Settings.SECRET);
    return decoded;
  }
}
