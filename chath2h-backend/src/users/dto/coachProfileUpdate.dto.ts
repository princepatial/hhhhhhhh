import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CoachPhotoDto {
  @IsNotEmpty()
  @IsString()
  fieldname: string;

  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  encoding: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  buffer: Buffer;

  @IsNotEmpty()
  size: number;
}

export class CoachProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  about: string;

  @IsOptional()
  @IsString()
  @MaxLength(550)
  coachCompetence: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CoachPhotoDto)
  coachPhoto: CoachPhotoDto;
}
