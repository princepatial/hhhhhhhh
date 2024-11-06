import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ad, AdSchema } from './entities/ad.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }]),
    FilesModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
