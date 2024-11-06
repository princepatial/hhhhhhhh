import { UnauthorizedException } from '@nestjs/common';

export class GlobalSkippableUnauthorizedException extends UnauthorizedException {
  skipGlobalExceptionHandler: boolean;
}
