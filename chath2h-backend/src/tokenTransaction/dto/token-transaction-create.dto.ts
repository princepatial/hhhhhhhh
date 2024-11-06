import { IsEnum, IsNotEmpty} from 'class-validator';
import { TokenTransactionFee } from '../entities/token-transaction-fee';
import { TokenTransactionType } from '../entities/token-transaction-type';
import { TokenTransactionStatus } from '../entities/token-transaction-status';
import { TokenTransactionBase } from './token-transaction.base';

export class TokenTransactionCreateDto extends TokenTransactionBase {
  public constructor(init?: Partial<TokenTransactionCreateDto>) {
    super(init);
    Object.assign(this, init);
  }
  errorMessage?: string;
  status: TokenTransactionStatus = TokenTransactionStatus.SUCCEDED;
  @IsEnum(TokenTransactionFee)
  @IsNotEmpty()
  fee: TokenTransactionFee
}
