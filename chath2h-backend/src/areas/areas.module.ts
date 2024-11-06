import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { Area, AreaSchema } from './entities/areas.entity';
import { TranslationModule } from 'src/translation/translation.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]),
    FilesModule,
    TranslationModule
  ],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
