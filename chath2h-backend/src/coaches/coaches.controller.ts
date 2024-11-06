import {
  Body,
  Controller,
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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { PaginationDto } from 'src/coach-offer/dto/coach-offer-paginate.dto';
import { Authless } from 'src/decorators/authless.decorator';
import { FilesService } from 'src/files/files.service';
import { Settings } from 'src/settings';
import { v4 as uuidv4 } from 'uuid';
import { CoachService } from './coaches.service';
import { CoachDto } from './dtos/coach.dto';
import { GetRandomCoachesDto } from './dtos/getRandomCoaches.dto';

@ApiTags('coaches')
@Controller('coaches')
export class CoachController {
  constructor(
    private readonly coachService: CoachService,
    private readonly filesService: FilesService,
  ) {}

  @Post('coachProfile')
  @UseInterceptors(
    FileInterceptor('coachPhoto', {
      storage: diskStorage({
        destination: './uploads/private_images/coach-avatars',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  async addCoachProfile(
    @Req() req: Request,
    @Body(new ValidationPipe()) coachProfileData: CoachDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_AVATAR_SIZE }),
        ],
        fileIsRequired: false,
      }),
    )
    coachPhoto?: Express.Multer.File,
  ) {
    const user = req.user._id;
    let imageId;

    if (coachPhoto) {
      imageId = await this.filesService.saveImage(coachPhoto);
    }

    const coachProfile = {
      ...coachProfileData,
      coachPhoto: imageId,
      user,
    };
    const result = await this.coachService.saveCoachProfile(user, coachProfile);
    return result;
  }

  @Authless()
  @Get()
  async getCoaches(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: PaginationDto,
    @Req() req: Request,
  ) {
    const coaches = await this.coachService.getAllCoaches(query, req.user?._id);
    return coaches;
  }

  @Get('favorite-coaches')
  async getFavoriteCoaches(@Req() req: Request) {
    if (!req.user) return;
    const favoriteCoaches = await this.coachService.getFavoriteCoaches(
      req.user._id,
    );
    return favoriteCoaches;
  }

  @Authless()
  @Get('top-coaches')
  async getTopCoaches() {
    const coaches = await this.coachService.getTopCoaches();
    return coaches;
  }

  @Authless()
  @Get(':id')
  async getCoach(@Param('id') id: string) {
    const coach = await this.coachService.getCoach(id);
    return coach;
  }

  @Authless()
  @Post('random-coaches')
  async getRandomCoaches(
    @Body(new ValidationPipe()) userIds: GetRandomCoachesDto,
    @Req() req: Request,
  ) {
    const randomCoaches = await this.coachService.getRandomCoaches(
      userIds.ids,
      req.user?._id,
    );
    return randomCoaches;
  }

  @Patch('update-favorite-coach/:favoriteUserId')
  async updateFavoriteCoaches(
    @Param('favoriteUserId') favoriteUserId: string,
    @Req() req: Request,
  ) {
    const currentUserId = req.user._id;
    const updatedUser = this.coachService.updateFavoriteCoaches(
      favoriteUserId,
      currentUserId,
    );
    return updatedUser;
  }
}
