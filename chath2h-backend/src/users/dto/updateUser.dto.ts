import { Transform } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { RegistrationDto } from 'src/auth/dto/registration.dto';
import {
  ProfessionalActivity,
  Gender,
  MaritalStatus,
  EducationName,
} from 'src/types/user-enums';

import { CoachPhotoDto, CoachProfileDto } from './coachProfileUpdate.dto';

export class UpdateUserDto extends RegistrationDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  @Transform((value) => Number.parseInt(value.value))
  @IsNumber()
  @IsOptional()
  age: number;

  @IsArray()
  @IsOptional()
  language: string[];

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsEnum(EducationName)
  @IsOptional()
  education: EducationName;

  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus: MaritalStatus;

  @IsString()
  @IsOptional()
  occupation: string;

  @IsEnum(ProfessionalActivity)
  @IsOptional()
  professionalActivity: ProfessionalActivity;

  @IsOptional()
  @ValidateNested()
  coachProfile: CoachProfileDto;

  @IsOptional()
  @ValidateNested()
  avatar: CoachPhotoDto;

  @IsOptional()
  @IsBoolean()
  isDisabled: boolean;
}
