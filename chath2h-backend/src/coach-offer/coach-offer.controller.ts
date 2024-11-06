import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Settings } from 'src/settings';
import { CoachOfferService } from './coach-offer.service';
import { OfferDto } from './dto/coach-offer.dto';
import { Request } from 'express';
import { PostponeOfferDto } from './dto/postpone-offer.dto';
import { CoachGuard } from 'src/guards/coach.guard';
import { PaginationDto } from './dto/coach-offer-paginate.dto';
import { UpdateOfferDto } from './dto/update-coach-offer.dto';
import { Authless } from 'src/decorators/authless.decorator';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { FilesService } from 'src/files/files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coach-offer')
@Controller('coach-offer')
export class CoachOfferController {
  constructor(
    private readonly coachOfferService: CoachOfferService,
    private readonly filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(CoachGuard)
  @UseInterceptors(
    FileInterceptor('representativePhoto', {
      storage: diskStorage({
        destination: './uploads/private_images/coach-offers',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async createCoachOffer(
    @Req() req: Request,
    @Body(new ValidationPipe()) newOfferData: OfferDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_AVATAR_SIZE }),
        ],
      }),
    )
    representativePhoto: Express.Multer.File,
  ) {
    const user = req.user._id;

    const imageId = await this.filesService.saveImage(representativePhoto);
    const offer = {
      ...newOfferData,
      representativePhoto: imageId,
      user,
    };
    return await this.coachOfferService.createOffer(offer);
  }

  @Patch(':id')
  async postponeOffer(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    body: PostponeOfferDto,
  ) {
    return await this.coachOfferService.postponeOffer(id, body.newOfferDate);
  }

  @Patch('update/:offerId')
  @UseInterceptors(
    FileInterceptor('representativePhoto', {
      storage: diskStorage({
        destination: './uploads/private_images/coach-offers',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async updateOffer(
    @Param('offerId') offerId: string,
    @Req() req: Request,
    @Body(new ValidationPipe()) offerData: UpdateOfferDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_IMAGE_SIZE }),
        ],
        fileIsRequired: false,
      }),
    )
    representativePhoto?: Express.Multer.File,
  ) {
    const userId = req.user._id;
    const imageId =
      representativePhoto &&
      (await this.filesService.saveImage(representativePhoto));
    const updateData = representativePhoto
      ? { ...offerData, representativePhoto: imageId }
      : offerData;

    if (!updateData.hashtags?.length) {
      updateData.hashtags = [];
    }

    const updatedOffer = await this.coachOfferService.updateOfferById(
      userId,
      offerId,
      updateData,
    );
    return updatedOffer;
  }

  @Authless()
  @Get()
  async getAllOffers(
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
    const coachOffers = await this.coachOfferService.getOffers(
      query,
      req?.user?.country,
    );
    return coachOffers;
  }

  @Authless()
  @Get(':id')
  async getOffer(@Param('id') id: string) {
    const coachOffers = await this.coachOfferService.getOfferById(id);
    return coachOffers;
  }

  @Delete(':offerId')
  async deleteNeed(@Param('offerId') offerId: string, @Req() req: Request) {
    await this.coachOfferService.deleteOffer(offerId, req.user._id);
  }
}
