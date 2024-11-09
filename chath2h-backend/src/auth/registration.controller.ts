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
  Query,
  Logger
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
import { ApiQuery } from '@nestjs/swagger';

@Authless()
@ApiTags('register')
@Controller('register')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

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
      
      // Extract and validate refToken
      const refToken = req.query.refToken as string;
      this.logger.debug(`Received refToken: ${refToken}`);
      
      if (!refToken) {
        throw new UnauthorizedException('Referral token is required');
      }
  
      // Decode the refToken to get the reference
      const data = this.refLinkService.decodeRefMagicLink(refToken) as { reference: string };
      this.logger.debug(`Decoded reference: ${data?.reference}`);
  
      // Ensure the refToken is valid and the email is provided
      if (!data?.reference || !registrationData.email) {
        throw new UnauthorizedException('Invalid referral token or email');
      }
  
      // Associate the referrer with the new user
      const user = {
        ...registrationData,
        avatar: imageId,
        referrer: data.reference,
      };
  
      const registeredUser = await this.authService.registerUser(user, true);
  
      return req.logIn(registeredUser, (error) => {
        if (error) {
          throw new UnauthorizedException('Login failed after registration');
        }
        return res.json(registeredUser);
      });
    } catch (err: any) { // Type the error as any to handle unknown error types
      this.logger.error('Registration error:', err);
      if (isMongoError(err) && err.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(
        err?.message || 'Something went wrong while registering the user'
      );
    }
  }
  @Post()
  @ApiQuery({ name: 'token', required: true })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/private_images/users',
        filename: (req, file, cb) => cb(null, uuidv4()),
      }),
    }),
  )
  @UseGuards(MagicLoginGuard)  // This guard will validate the token
  async registerUser(
    @Req() req: Request,
    @Res() res: Response,
    @Query('token') token: string,
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
      this.logger.debug(`Received token: ${token}`);
      
      // Verify token presence
      if (!token) {
        this.logger.error('No token provided');
        throw new UnauthorizedException('Registration token is required');
      }

      // Verify user from the guard
      if (!req.user) {
        this.logger.error('No user found in request');
        throw new UnauthorizedException('Registration token has expired or is invalid');
      }

      this.logger.debug(`Processing registration for email: ${(req.user as any).email}`);
      const imageId = await this.filesService.saveImage(avatar);

      const user = {
        ...registrationData,
        email: (req.user as any).email,
        avatar: imageId,
        token,
      };

      const registeredUser = await this.authService.registerUser(user);

      return req.logIn(registeredUser, (error) => {
        if (error) {
          this.logger.error('Login failed after registration:', error);
          throw new UnauthorizedException('Login failed after registration');
        }
        return res.json(registeredUser);
      });
    } catch (err: any) {
      this.logger.error('Registration error:', err);
      if (isMongoError(err) && err.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new BadRequestException(err?.message || 'Registration failed');
    }
  }
}