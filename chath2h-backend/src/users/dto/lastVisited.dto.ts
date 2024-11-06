import { IsOptional, IsString } from 'class-validator';

export class saveLastVisitedDto {
  @IsString()
  @IsOptional()
  offerId?: string;

  @IsString()
  @IsOptional()
  coachId?: string;

  @IsString()
  @IsOptional()
  needId?: string;
}
