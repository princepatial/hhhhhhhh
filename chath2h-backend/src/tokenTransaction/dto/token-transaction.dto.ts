import { IsDate } from 'class-validator';
import { TokenTransactionType } from '../entities/token-transaction-type';
import { TokenTransactionKind } from '../entities/token-transaction-kind';
import { TokenTransactionBase } from './token-transaction.base';

export class TokenTransactionDto extends TokenTransactionBase {
  public constructor(init?: Partial<TokenTransactionDto>) {
    super(init);
    Object.assign(this, init);
  }

  type: TokenTransactionType;

  kind: TokenTransactionKind;

  @IsDate()
  createdAt: Date;
}
