import { IsNotEmpty, IsString } from 'class-validator';
import InternalRequestBase from 'src/communication/transport/internal-request.base';

export default class UserOnlineRequest extends InternalRequestBase {
  constructor(user: string) {
    super();
    this.user = user;
  }
  @IsString()
  @IsNotEmpty()
  user: string;
}
