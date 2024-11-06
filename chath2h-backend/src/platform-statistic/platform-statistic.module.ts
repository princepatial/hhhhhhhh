import { Module } from '@nestjs/common';
import { PlatformStatisticController } from './platform-statistic.controller';
import { PlatformStatisticService } from './platform-statistic.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PlatformStatisticController],
  providers: [PlatformStatisticService],
  exports: [PlatformStatisticService],
})
export class PlatformStatisticModule {}
