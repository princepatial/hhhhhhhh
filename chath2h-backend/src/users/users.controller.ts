import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { Authless } from 'src/decorators/authless.decorator';
import { FilesService } from 'src/files/files.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';
import { v4 as uuidv4 } from 'uuid';
import { saveLastVisitedDto } from './dto/lastVisited.dto';
import { PlatformStatisticQueryDto } from './dto/platform-statistic.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PaginationUserDto } from './dto/users-paginate.dto';
import { LastVisited } from './last-visited.service';
import { UsersService } from './users.service';
import { FileUploadValidators } from './validators/file-upload.validators';
import { exportWordCsvController } from 'src/utils/exportWordCsv';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly lastVisited: LastVisited,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: PaginationUserDto,
  ) {
    const users = await this.usersService.getAllQuery(query);
    return users;
  }

  @UseGuards(AdminGuard)
  @Get('users-list-file')
  async getUsersListFile(
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true }))
    query: PlatformStatisticQueryDto,
  ) {
    const isExcel = query?.isExcel;
    const usersListFile = await this.usersService.getUsersListFile(isExcel);

    return exportWordCsvController(res, usersListFile, isExcel);
  }

  @UseGuards(AdminGuard)
  @Patch('disableOrEnable/:id')
  async disableUser(
    @Req() req: Request,
    @Param('id') id: string,
    @Body(new ValidationPipe())
    body: UpdateUserDto,
  ) {
    return await this.usersService.disableOrEnableUser(id, body.isDisabled);
  }

  @Authless()
  @Patch('read-welcome-message')
  async welcomeMessage(@Req() req: Request) {
    const userId = req.user._id;
    return await this.usersService.markAsReadWelcomeMessage(userId);
  }

  @Authless()
  @UseGuards(UserGuard)
  @Patch('ref-link')
  async getRefLink(@Req() req: Request) {
    const userId = req.user._id;
    return await this.usersService.generateRefLink(userId);
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'coachPhoto', maxCount: 1 },
      ],
      {
        fileFilter: FileUploadValidators.validateImage,
        storage: diskStorage({
          destination: './uploads/private_images/users',
          filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
        }),
      },
    ),
  )
  async updateUserDetails(
    @Param('id') id: string,
    @Req() req: Request,
    @Body(new ValidationPipe())
    body: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      coachPhoto?: Express.Multer.File[];
    },
    @Res() res: Response,
  ) {
    const { avatar: [avatar] = [], coachPhoto: [coachPhoto] = [] } = files || {
      avatar: [],
      coachPhoto: [],
    };
    let avatarId;
    let coachPhotoId;
    if (avatar) avatarId = await this.filesService.saveImage(avatar);
    if (coachPhoto)
      coachPhotoId = await this.filesService.saveImage(coachPhoto);

    const updatedUser = await this.usersService.updateUserById(
      req.user._id,
      body,
      avatarId,
      coachPhotoId,
    );

    res.send(updatedUser);
  }

  @Get('my-needs-and-offers')
  async getMyNeedsAndOffers(@Req() req: Request) {
    const userId = req.user._id;
    const myNeedsAndOffers = await this.usersService.getMyNeedsAndOffers(
      userId,
    );
    return myNeedsAndOffers;
  }

  @Authless()
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  @Authless()
  @Post('last-visited')
  async saveVisited(
    @Req() req: Request,
    @Body(new ValidationPipe())
    resource: saveLastVisitedDto,
  ) {
    if (!req.user?._id) return;
    await this.lastVisited.saveVisited({
      ...resource,
      userId: req.user._id,
    });
    return 'ok';
  }
}
