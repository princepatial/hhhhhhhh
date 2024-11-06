import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Request } from 'express';
import { ApiTags } from  '@nestjs/swagger';
import {UserGuard} from "../guards/user.guard";

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(UserGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findDashboardUser(@Req() req: Request) {
    return this.dashboardService.findDashboardUser(req.user._id);
  }
}
