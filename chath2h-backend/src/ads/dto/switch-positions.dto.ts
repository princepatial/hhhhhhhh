import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

export class SwitchPositionsDto {
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;
}
