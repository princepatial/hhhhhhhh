import {
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { FilterQuery } from 'mongoose';
import { FilterParser } from 'src/utils/custom-age-parser';
export class PaginationDto {
  @ValidateNested()
  @Transform(({ value }) => {
    const filterParser = new FilterParser();
    return filterParser.parse(value);
  })
  filterBy?: FilterQuery<string>;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = JSON.parse(value);
    return Object.keys(parsedValue).length ? parsedValue : { createdAt: 1 };
  })
  @IsObject()
  sortBy?: Record<string, 1 | -1>;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number;
}
