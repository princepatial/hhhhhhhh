import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CoachDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  about: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(550)
  coachCompetence: string;
}
