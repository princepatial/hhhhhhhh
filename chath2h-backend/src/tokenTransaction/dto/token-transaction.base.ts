import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { TokenTransactionType } from '../entities/token-transaction-type';

export class TokenTransactionBase {
  public constructor(init?: Partial<TokenTransactionBase>) {
    Object.assign(this, init);
  }
  @IsString()
  sender?: string;

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  type: TokenTransactionType;

}
