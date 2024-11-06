import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class PlatformStatisticQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExcel?: boolean;
}
