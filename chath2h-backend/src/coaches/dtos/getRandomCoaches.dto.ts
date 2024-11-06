import { IsArray } from 'class-validator';

export class GetRandomCoachesDto {
  @IsArray()
  ids: string[];
}
