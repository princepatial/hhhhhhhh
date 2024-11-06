import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaDto } from './create-area.dto';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;

  @IsMongoId()
  @IsOptional()
  areaImage: ObjectId;
}
