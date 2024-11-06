import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ValidationPipe,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import InterationRequestDto from './dto/interaction-request.dto';
import InteractionRequestService from './services/interaction-request.service';
import InteractionRequestUser from './dto/interaction-request-user.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('chat-request')
@Controller('chat-request')
export class ChatRequestController {
  constructor(
    private readonly interactionRequestService: InteractionRequestService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(new ValidationPipe()) interactionRequest: InterationRequestDto,
  ) {
    const userId = req.user._id;

    if (interactionRequest.need && interactionRequest.user != userId) {
      const [user, coach] = await Promise.all([
        this.userService.findOneById(userId).lean(),
        this.userService.findOneById(interactionRequest.coach).lean(),
      ]);

      if (user.coachProfile == undefined || coach.coachProfile == undefined) {
        const error = "Users without coach profile can't start chat in need";

        throw new BadRequestException(error);
      }
    }

    interactionRequest.initiator = userId;

    const usersInChat = await this.userService.checkIsInChat([
      interactionRequest.user,
      interactionRequest.coach,
    ]);

    if (usersInChat) {
      const error =
        'Any of user is in chat, You cannot start chat with this user';

      throw new BadRequestException(error);
    }

    return this.interactionRequestService.createInteractionRequest(
      interactionRequest,
    );
  }

  @Post('decline/:id')
  async decline(@Req() req: Request, @Param('id') id: string) {
    return this.interactionRequestService.declineInteractionRequest(
      new InteractionRequestUser(req.user._id, id),
    );
  }

  @Post('accept/:id')
  async accept(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { socketId: string },
  ) {
    return this.interactionRequestService.acceptInteractionRequest(
      new InteractionRequestUser(req.user._id, id, body.socketId),
    );
  }

  @Get()
  async getActiveRequests(@Req() req: Request) {
    return await this.interactionRequestService.getActiveRequests(req.user._id);
  }

  @Get('/:id')
  async getActiveRequest(@Req() req: Request, @Param('id') id: string) {
    return await this.interactionRequestService.getActiveRequest(id);
  }
}
