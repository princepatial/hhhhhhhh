import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('platform-statistic')
@Controller('platform-statistic')
export class PlatformStatisticController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async getUser() {
    const user = await this.usersService.getUsersStatistics();
    return user;
  }
}
