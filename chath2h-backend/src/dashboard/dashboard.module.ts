import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UsersModule } from 'src/users/users.module';
import { NeedsModule } from 'src/needs/needs.module';
import { CoachOfferModule } from 'src/coach-offer/coach-offer.module';
import { CoachesModule } from 'src/coaches/coaches.module';
import { UserGuard } from 'src/guards/user.guard';

@Module({
  imports: [UsersModule, NeedsModule, CoachOfferModule, CoachesModule],
  controllers: [DashboardController],
  providers: [DashboardService, UserGuard,],
})
export class DashboardModule { }
