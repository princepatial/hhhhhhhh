import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class UserBalanceRequest extends SocketRequestBase {
  constructor(
    recipient: MessageRecipient,
    balances: Record<string, number>,
  ) {
    super(recipient);
    this.balances = balances;
  }
  @IsNotEmptyObject()
  balances: Record<string, number>;
  @IsString()
  @IsNotEmpty()
  interactionId: string;
}
