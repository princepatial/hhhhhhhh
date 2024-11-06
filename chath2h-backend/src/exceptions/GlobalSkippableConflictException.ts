import { ConflictException, HttpExceptionOptions } from '@nestjs/common';

export class GlobalSkippableConflictException extends ConflictException {
  skipGlobalExceptionHandler: true;
}
