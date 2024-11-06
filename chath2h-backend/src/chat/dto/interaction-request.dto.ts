import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class InterationRequestDto {
  @IsString()
  @IsOptional()
  initiator: string;
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  coach: string;
  @IsString()
  @IsOptional()
  need?: string;
  @IsString()
  @IsOptional()
  coachOffer?: string;
  @IsString()
  @IsOptional()
  conversation?: string;
}
