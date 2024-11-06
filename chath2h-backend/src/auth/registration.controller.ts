import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { Authless } from 'src/decorators/authless.decorator';
import { FilesService } from 'src/files/files.service';
import { RefLinkService } from 'src/magic-link-creator/ref-magic-link';
import { Settings } from 'src/settings';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { MagicLoginGuard } from './authenticated.guard';
import { RegistrationDto } from './dto/registration.dto';
import { isMongoError } from './guards/mongoError';

@Authless()
@ApiTags('register')
@Controller('register')
export class RegistrationController {
  constructor(
    private readonly authService: AuthService,
    private readonly filesService: FilesService,
    private readonly refLinkService: RefLinkService,
  ) {}

  @Post('referral')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/private_images/users',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  @Authless()
  async registerReferralUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) registrationData: RegistrationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_AVATAR_SIZE }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    try {
      const imageId = await this.filesService.saveImage(avatar);

      const { refToken } = req.query;

      const user = {
        ...registrationData,
        avatar: imageId,
      };

      const data = this.refLinkService.decodeRefMagicLink(
        refToken as string,
      ) as { reference: string };

      if (!data.reference || !user.email) throw new UnauthorizedException();

      user.referrer = data?.reference;

      const registeredUser = await this.authService.registerUser(user, true);

      return req.logIn(registeredUser, (error) => {
        if (error) {
          throw new UnauthorizedException();
        }
        return res.json(user);
      });
    } catch (err) {
      if (isMongoError(err) && err.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(
        'something went wrong while registering user',
      );
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/private_images/users',
        filename: (req, file, cb) => cb(null, (file.filename = uuidv4())),
      }),
    }),
  )
  @UseGuards(MagicLoginGuard)
  async registerUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) registrationData: RegistrationDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /^image\/(png|jpg|jpeg)$/ }),
          new MaxFileSizeValidator({ maxSize: Settings.MAX_AVATAR_SIZE }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    try {
      const imageId = await this.filesService.saveImage(avatar);

      const user = {
        ...registrationData,
        email: req.user.email,
        avatar: imageId,
      };

      const registeredUser = await this.authService.registerUser(user);

      return req.logIn(registeredUser, (error) => {
        if (error) {
          throw new UnauthorizedException();
        }
        return res.json(user);
      });
    } catch (err) {
      if (isMongoError(err) && err.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(
        'something went wrong while registering user',
      );
    }
  }
}
