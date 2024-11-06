import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { FilesService } from './files.service';
import { Authless } from 'src/decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';

@Authless()
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Get(':id')
  async getDatabaseFileById(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const file = await this.filesService.getImage(id);

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.filename}.png"`,
      'Content-Type': file.mimetype,
    });
    return new StreamableFile(stream);
  }
}
