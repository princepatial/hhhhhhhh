import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaymentDto {
  @IsPositive()
  @IsNumber()
  @Min(1)
  quantity: number;
  userId: string;

  @IsOptional()
  initDataAfterPay: any;
}
