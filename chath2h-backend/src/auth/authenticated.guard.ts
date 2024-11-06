import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GlobalSkippableUnauthorizedException } from '../exceptions/GlobalSkippableUnauthorizedException';
import { Reflector } from '@nestjs/core';

const unrestrictedUrls = [
  '/api/settings',
  '/api/areas',
  '/api/auth/me',
  '/api/users',
  '/api/coach-offer',
  '/api/needs',
];

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // @Authless() decorator is applicable on the controller or handler
    const excludedResource =
      this.reflector.get<boolean>('excludedResource', context.getHandler()) ||
      this.reflector.get<boolean>('excludedResource', context.getClass());

    if (excludedResource) return true;

    return request.isAuthenticated();
  }
}

export class MagicLoginGuard extends AuthGuard('magiclogin') {
  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const result = await super.canActivate(context);
      if (!result) return false;
      const request = context.switchToHttp().getRequest();
      if (request.user?._id) {
        await super.logIn(request);
      }

      return result;
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Unauthorized')
        throw new GlobalSkippableUnauthorizedException({
          statusCode: 401,
          message: 'Token has expired',
          skipGlobalExceptionHandler: true,
        });
    }
  }
}
