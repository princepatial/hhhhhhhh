import { Logger, Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { CoachOfferModule } from 'src/coach-offer/coach-offer.module';
import { LastVisited } from './last-visited.service';
import { NeedsModule } from 'src/needs/needs.module';
import { CoachesModule } from 'src/coaches/coaches.module';
import { Area, AreaSchema } from 'src/areas/entities/areas.entity';
import { FilesModule } from 'src/files/files.module';
import { RefLinkService } from 'src/magic-link-creator/ref-magic-link';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    forwardRef(() => CoachOfferModule),
    NeedsModule,
    CoachesModule,
    FilesModule,
  ],
  providers: [UsersService, LastVisited, Logger, RefLinkService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
