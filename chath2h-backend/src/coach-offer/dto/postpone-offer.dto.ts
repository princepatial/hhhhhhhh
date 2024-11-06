import { Transform } from 'class-transformer';
import { IsNotEmpty, IsDate, Validate } from 'class-validator';
import { AvailableFromDateValidationPipe } from '../validation/availableFromValidator';

export class PostponeOfferDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @Validate(AvailableFromDateValidationPipe)
  newOfferDate: Date;
}
