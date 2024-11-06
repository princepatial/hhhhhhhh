import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdsLocation } from '../types/ads-enums';
import { Type } from 'class-transformer';

export class CreateAdDto {
  @IsString()
  @IsNotEmpty()
  redirectPath: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AdsLocation)
  @IsNotEmpty()
  location: AdsLocation;

  @Type(() => Object)
  adImage: Express.Multer.File;
}
