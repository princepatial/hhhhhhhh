import { IsMongoId, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class GrantTokensDto {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
  @IsNumber()
  @IsPositive()
  amount: number;
}
