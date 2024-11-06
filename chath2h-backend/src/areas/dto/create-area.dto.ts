import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Object)
  image: Express.Multer.File;
}
