import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ name: 'availableFrom' })
@Injectable()
export class AvailableFromDateValidationPipe
  implements ValidatorConstraintInterface
{
  validate(value: Date): boolean {
    const currentDate = dayjs();
    const maxDelay = 14;

    const targetDate = dayjs(value);
    const isAfterCurrDate = targetDate.isAfter(
      currentDate.add(maxDelay, 'days'),
    );
    const isBeforeCurrDate = targetDate.isBefore(currentDate, 'days');

    if (isAfterCurrDate || isBeforeCurrDate) {
      throw new BadRequestException(
        'availableFrom date must be at least 1 day and not more than 14 days from now',
      );
    }

    return true;
  }
}
