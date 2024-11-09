import {
  Body,
  Controller, ForbiddenException,
  Get,
  Next,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLoginStrategy } from './magiclogin.strategy';
import { PasswordlessAuthorization } from './dto/passwordless-authorization.dto';
import { NextFunction, Request, Response } from 'express';
import { MagicLoginGuard } from './authenticated.guard';
import { GlobalSkippableConflictException } from 'src/exceptions/GlobalSkippableConflictException';
import { UsersService } from 'src/users/users.service';
import { Authless } from 'src/decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserGuard } from "../guards/user.guard";
import { MailService } from '../mail/mail.service'; // Add this import

@Authless()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService, // Add this
    private strategy: MagicLoginStrategy,
  ) {}

  @Post('') // Change this from @Post() to @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) body: PasswordlessAuthorization,
  ) {
    try {
      await this.authService.validateUser(body.destination);

      // Send magic link email
      await this.mailService.send({
        to: body.destination,
        subject: "Magic Login Link",
        html: `<p>Click the link in the magic login strategy to log in.</p>`
      });

      return this.strategy.send(req, res);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  @UseGuards(MagicLoginGuard)
@Get('*/callback')
callback(@Req() req: Request, @Res() res: Response) {
  const userId = req.user._id;
  if (!userId) {
    throw new GlobalSkippableConflictException({
      statusCode: 409,
      message: 'User needs to complete the registration',
      skipGlobalExceptionHandler: true,
    });
  }

  // Redirect the user to the registration page without any further redirection
  res.redirect(`/en/register?token=${req.query.token}`);

  // Do not send any response or perform any other actions
  // Return immediately to prevent any further processing
  return;
}



  @Get('me')
  async me(@Req() req: Request) {
    if (!req.user) return;
    const user = await this.userService.findOneById(req.user._id);
    if (user.isDisabled) {
      throw new ForbiddenException('This user is disabled');
    }
    await this.userService.updateIsInChat([user._id]);
    return user;
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.clearCookie('H2H_auth_cookie');
        return res.json('ok');
      });
    });
  }
}