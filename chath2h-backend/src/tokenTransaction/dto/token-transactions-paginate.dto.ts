import { IsArray, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { TokenTransactionDto } from './token-transaction.dto';

export class TokenTransactionsPaginateDto {
  @IsArray()
  @ValidateNested({ each: true })
  docs: TokenTransactionDto[];

  @IsBoolean()
  hasNextPage: boolean;

  @IsNumber()
  totalPages: number;

  @IsNumber()
  skip: number;
}
