import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Files, FilesSchema } from './entity/files.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Files.name, schema: FilesSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
