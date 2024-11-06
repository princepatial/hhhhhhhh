import { Module } from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedsController } from './needs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NeedOffer, NeedOfferSchema } from './entities/need.entity';
import { FilesModule } from 'src/files/files.module';
import {
  CoachOffer,
  CoachOfferSchema,
} from 'src/coach-offer/entity/coach-offer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NeedOffer.name, schema: NeedOfferSchema },
      { name: CoachOffer.name, schema: CoachOfferSchema },
    ]),
    FilesModule,
  ],
  controllers: [NeedsController],
  providers: [NeedsService],
  exports: [NeedsService],
})
export class NeedsModule {}
