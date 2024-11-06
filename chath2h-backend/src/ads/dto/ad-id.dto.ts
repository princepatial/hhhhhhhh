import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class AdIdDto {
  @IsMongoId()
  @IsNotEmpty()
  id: ObjectId;
}
