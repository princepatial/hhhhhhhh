import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'hashtags', async: true })
@Injectable()
export class HashtagLengthValidationPipe
  implements ValidatorConstraintInterface
{
  validate(value: string[]): boolean {
    const hashtagsLength = value.join('').length;

    if (hashtagsLength > 60) {
      throw new BadRequestException(
        'combined hashtags char length must not be greater than 60',
      );
    }

    return true;
  }
}
