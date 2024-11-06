import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class GetTransactionsDto {
  public constructor(init?: Partial<GetTransactionsDto>) {
    Object.assign(this, init);
  }
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsNumber()
  @IsPositive()
  limit: number;
  @IsNumber()
  @IsPositive()
  skip: number;
  @IsString()
  type?: string;
}
