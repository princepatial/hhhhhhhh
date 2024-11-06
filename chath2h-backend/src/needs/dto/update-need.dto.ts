import { PartialType } from '@nestjs/mapped-types';
import { NeedDto } from './need.dto';

export class UpdateNeedDto extends PartialType(NeedDto) {}
