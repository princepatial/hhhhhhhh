import { Module, forwardRef } from '@nestjs/common';
import { CoachOfferService } from './coach-offer.service';
import { CoachOfferController } from './coach-offer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoachOffer, CoachOfferSchema } from './entity/coach-offer.entity';
import { UsersModule } from 'src/users/users.module';
import { CoachesModule } from 'src/coaches/coaches.module';
import { FilesModule } from 'src/files/files.module';
import { NeedOffer, NeedOfferSchema } from 'src/needs/entities/need.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoachOffer.name, schema: CoachOfferSchema },
      { name: NeedOffer.name, schema: NeedOfferSchema },
    ]),
    forwardRef(() => UsersModule),
    CoachesModule,
    FilesModule,
  ],
  providers: [CoachOfferService],
  controllers: [CoachOfferController],
  exports: [CoachOfferService],
})
export class CoachOfferModule {}
