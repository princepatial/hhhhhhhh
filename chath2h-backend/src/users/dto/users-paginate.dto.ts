import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class PaginationUserDto {
  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = JSON.parse(value);
    return Object.keys(parsedValue).length ? parsedValue : [];
  })
  filterBy?: Array<{ id: string; value: string }>;

  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = JSON.parse(value);
    return Object.keys(parsedValue).length ? parsedValue : { createdAt: 1 };
  })
  @IsObject()
  sortBy?: Record<string, 1 | -1>;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page?: number;
}
