import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  ValidationPipe,
  Req,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { NeedsService } from './needs.service';
import { NeedDto } from './dto/need.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Settings } from 'src/settings';
import { Request } from 'express';
import { PaginationDto } from 'src/coach-offer/dto/coach-offer-paginate.dto';
import { UpdateNeedDto } from './dto/update-need.dto';
import { Authless } from 'src/decorators/authless.decorator';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from 'src/files/files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('needs')
@Controller('needs')
export class NeedsController {
  constructor(
    private readonly needsService: NeedsService,
    private readonly filesService: FilesService,
  ) {}

  @Patch('update/:needId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/private_images/need-offers',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async updateNeed(
    @Param('needId') needId: string,
    @Req() req: Request,
    @Body(new ValidationPipe()) needData: UpdateNeedDto,
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
    const userId = req.user._id;
    const imageId = image && (await this.filesService.saveImage(image));
    const updateData = image ? { ...needData, image: imageId } : needData;
    if (!updateData.hashtags?.length) {
      updateData.hashtags = [];
    }
    const updatedNeed = await this.needsService.updateNeedById(
      userId,
      needId,
      updateData,
    );
    return updatedNeed;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/private_images/need-offers',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async createNeed(
    @Req() req: Request,
    @Body(new ValidationPipe()) needOfferData: NeedDto,
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
    const user = req.user._id;

    const imageId = await this.filesService.saveImage(image);

    const need = {
      ...needOfferData,
      image: imageId,
      user,
    };
    return this.needsService.createNeed(need);
  }

  @Authless()
  @Get()
  async getAllNeeds(
    @Req() req: Request,
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: PaginationDto,
  ) {
    const getNeedOffer = await this.needsService.getNeeds(
      query,
      req?.user?.country,
    );
    return getNeedOffer;
  }
  @Authless()
  @Get(':needId')
  findOne(@Param('needId') needId: string) {
    return this.needsService.getNeedById(needId);
  }

  @Delete(':needId')
  async deleteNeed(@Param('needId') needId: string, @Req() req: Request) {
    await this.needsService.deleteNeed(needId, req.user._id);
  }
}
