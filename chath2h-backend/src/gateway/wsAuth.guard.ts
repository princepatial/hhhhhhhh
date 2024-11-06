import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class wsAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    const request = client.request;
    return request.isAuthenticated();
  }
}
