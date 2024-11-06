import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ValidationPipe,
  Req,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { AreasService } from './areas.service';
import { Authless } from 'src/decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Settings } from 'src/settings';
import { FilesService } from 'src/files/files.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { Request } from 'express';

@ApiTags('areas')
@Controller('areas')
export class AreasController {
  constructor(
    private readonly areaService: AreasService,
    private readonly filesService: FilesService,
  ) {}

  @Authless()
  @Get()
  async getAreas() {
    const areas = await this.areaService.getAreas();
    return areas;
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/public_images/areas',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async createArea(
    @Req() req: Request,
    @Body(new ValidationPipe()) area: CreateAreaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_IMAGE_SIZE }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const areaImage = await this.filesService.saveImage(image);
    const areaWithImage = { ...area, areaImage };
    const createdArea = (
      await this.areaService.createArea(areaWithImage)
    ).toObject();
    return { ...createdArea, filename: image.filename };
  }

  @Patch()
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/public_images/areas',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async updateArea(
    @Req() req: Request,
    @Body(new ValidationPipe()) area: UpdateAreaDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_IMAGE_SIZE }),
        ],
      }),
    )
    image?: Express.Multer.File,
  ) {
    const areaImage = image && (await this.filesService.saveImage(image));
    const areaWithImage = { ...area, areaImage };
    return this.areaService.updateArea(areaWithImage);
  }

  @Delete(':areaId')
  @UseGuards(AdminGuard)
  async softDeleteArea(@Param('areaId') areaId: string) {
    return this.areaService.deleteArea(areaId);
  }
}
