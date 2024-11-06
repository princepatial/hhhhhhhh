import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateAdDto } from './create-ad.dto';
import { ObjectId } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAdDto extends PartialType(CreateAdDto) {
  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;

  @IsMongoId()
  @IsOptional()
  image: ObjectId;
}
