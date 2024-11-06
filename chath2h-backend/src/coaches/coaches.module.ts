import { Module } from '@nestjs/common';
import { CoachController } from './coaches.controller';
import { CoachService } from './coaches.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Area, AreaSchema } from 'src/areas/entities/areas.entity';
import { FilesModule } from 'src/files/files.module';
import { RefLinkService } from 'src/magic-link-creator/ref-magic-link';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    FilesModule,
  ],
  controllers: [CoachController],
  providers: [CoachService, UsersService, RefLinkService],
  exports: [CoachService],
})
export class CoachesModule {}
