import {
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(
    exception: HttpException | { message?: string | object; stack: string },
    host: ArgumentsHost,
  ) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const responseBody = {
      message: exception?.message || 'an unknown error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    this.logger.error(exception);
    super.catch(new InternalServerErrorException(responseBody), host);
  }
}
