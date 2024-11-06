import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GenerateTransactionTokens {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExcel?: boolean;

  @IsString()
  @IsOptional()
  fromDate?: string;

  @IsString()
  @IsOptional()
  toDate?: string;
}
