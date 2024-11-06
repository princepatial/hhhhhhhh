import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {AuthService} from "../auth/auth.service";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
      private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    if(!req.user) return false;

    const user = await this.userService.getById(req.user._id);

    if (!user || user.isDisabled) {
      req.session.destroy(() => {
        res.clearCookie('H2H_auth_cookie');
        return res.error(new ForbiddenException('This user is disabled'));
      });
    }

    return !user?.isDisabled;
  }
}
