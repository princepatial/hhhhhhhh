import { IsNotEmpty, IsString } from 'class-validator';
import { TokenTransactionBase } from './token-transaction.base';

export class TokenTransactionUpdateDto extends TokenTransactionBase {
  public constructor(init?: Partial<TokenTransactionUpdateDto>) {
    super(init);
    Object.assign(this, init);
  }

  @IsString()
  @IsNotEmpty()
  id: string;
}
