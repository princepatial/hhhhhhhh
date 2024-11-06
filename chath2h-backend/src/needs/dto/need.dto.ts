import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { HashtagLengthValidationPipe } from 'src/validations/HashtagLengthValidationPipe';

export class NeedDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  problemTitle: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  description: string;

  @IsArray()
  @IsOptional()
  @Validate(HashtagLengthValidationPipe)
  hashtags: string[];

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsMongoId()
  @IsOptional()
  image: ObjectId;
}
