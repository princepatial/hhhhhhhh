import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDate,
  IsArray,
  Validate,
  MaxLength,
  IsBoolean,
  IsMongoId,
} from 'class-validator';
import { AvailableFromDateValidationPipe } from '../validation/availableFromValidator';
import { HashtagLengthValidationPipe } from 'src/validations/HashtagLengthValidationPipe';
import { ObjectId } from 'mongoose';

export class OfferDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  problemTitle: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  description: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @Validate(AvailableFromDateValidationPipe)
  availableFrom: Date;

  @IsArray()
  @IsOptional()
  @Validate(HashtagLengthValidationPipe)
  hashtags: string[];

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsMongoId()
  @IsOptional()
  representativePhoto: ObjectId;
}
