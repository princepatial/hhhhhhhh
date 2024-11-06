import { PartialType } from '@nestjs/mapped-types';
import { OfferDto } from './coach-offer.dto';

export class UpdateOfferDto extends PartialType(OfferDto) {}
