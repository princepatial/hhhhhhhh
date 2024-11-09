import { Transform,Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  EducationName,
  Gender,
  MaritalStatus,
  ProfessionalActivity,
} from 'src/types/user-enums';

export class RegistrationDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @Transform((value) => Number.parseInt(value.value))
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsArray()
  @IsNotEmpty()
  @Type(() => String)
  language: string[];

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsOptional()
  referrer: string;

  @IsString()
  @IsOptional()
  email: string;
}
