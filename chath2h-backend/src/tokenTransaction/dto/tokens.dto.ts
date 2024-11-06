import { IsEmail, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class TokenDistributionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  tokens: number;
}
