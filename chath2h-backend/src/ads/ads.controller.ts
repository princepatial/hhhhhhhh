import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  ValidationPipe,
  Delete,
  UploadedFile,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UseInterceptors,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { Authless } from 'src/decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AdIdDto } from './dto/ad-id.dto';
import { CreateAdDto } from './dto/create-ad.dto';
import { SwitchPositionsDto } from './dto/switch-positions.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { Settings } from 'src/settings';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from 'src/files/files.service';
import { v4 as uuidv4 } from 'uuid';
import { AdminGuard } from 'src/guards/admin.guard';
import { AdsLocation } from './types/ads-enums';
@Authless()
@ApiTags('advertisement')
@Controller('advertisement')
export class AdsController {
  constructor(
    private readonly adsService: AdsService,
    private readonly filesService: FilesService,
  ) {}

  @Post('views')
  async createViews(@Body() adId: AdIdDto) {
    return await this.adsService.createViews(adId);
  }

  @Post('visits')
  async createVisits(@Body() adId: AdIdDto) {
    return await this.adsService.createVisits(adId);
  }

  @Get()
  async getAds(@Query() query: { type: AdsLocation }) {
    const ads = await this.adsService.getAds({ type: query?.type });
    return ads;
  }

  @UseGuards(AdminGuard)
  @Get('/admin')
  async getAdminAds() {
    const ads = await this.adsService.getAds({ isSortByName: true });
    return ads;
  }

  @UseInterceptors(
    FileInterceptor('adImage', {
      storage: diskStorage({
        destination: './uploads/public_images/ads',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  @UseGuards(AdminGuard)
  @Post()
  async addAdvertisement(
    @Body() createAd: CreateAdDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_IMAGE_SIZE }),
        ],
      }),
    )
    adImage: Express.Multer.File,
  ) {
    const image = await this.filesService.saveImage(adImage);
    return this.adsService.createAd({ ...createAd, image });
  }

  @UseGuards(AdminGuard)
  @Patch('position')
  async adPosition(@Body(new ValidationPipe()) createAd: SwitchPositionsDto) {
    return this.adsService.replacePosition(createAd);
  }

  @UseInterceptors(
    FileInterceptor('adImage', {
      storage: diskStorage({
        destination: './uploads/public_images/ads',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  @UseGuards(AdminGuard)
  @Patch()
  async updateAd(
    @Body(new ValidationPipe()) updateData: UpdateAdDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_IMAGE_SIZE }),
        ],
      }),
    )
    adImage?: Express.Multer.File,
  ) {
    const image = adImage && (await this.filesService.saveImage(adImage));
    const adWithImage = { ...updateData, image };
    return this.adsService.updateAd(adWithImage);
  }

  @UseGuards(AdminGuard)
  @Delete(':adId')
  async deleteAd(@Param('adId') adId: AdIdDto) {
    return this.adsService.deleteAd(adId);
  }
}
