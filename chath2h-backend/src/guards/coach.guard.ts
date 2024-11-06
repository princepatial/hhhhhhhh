import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CoachGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const userId = req.user._id;
    if (!userId) return false;

    const user = await this.userService.findOneById(userId);

    return !!user.coachProfile;
  }
}
