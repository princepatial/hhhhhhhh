import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/guards/user.guard';
import FinishInteractionDto from './dto/finishInteraction.dto';
import InteractionPaymentDto from './dto/interaction-payment.dto';
import InterationRequestDto from './dto/interaction-request.dto';
import RateInteractionDto from './dto/rate-interaction.dto';
import updateInteractionTimeDto from './dto/update-interaction-time.dto';
import InteractionRequestService from './services/interaction-request.service';
import InteractionService from './services/interaction.service';

@ApiTags('chat')
@Controller('chat')
@UseGuards(UserGuard)
export class ChatController {
  constructor(
    private readonly interactionRequestService: InteractionRequestService,
    private readonly interactionService: InteractionService,
  ) {}

  @Get('/:interactionId')
  async getInteraction(
    @Req() req: Request,
    @Param('interactionId') interactionId: string,
  ) {
    const user = req.user._id;
    return this.interactionService.getInteraction(interactionId, user);
  }

  @Post('join')
  async createInteractionRequest(
    @Req() req: Request,
    @Body(new ValidationPipe()) interationRequest: InterationRequestDto,
  ) {
    interationRequest.initiator = req.user._id;
    return this.interactionRequestService.createInteractionRequest(
      interationRequest,
    );
  }

  @Patch('duration')
  async updateInteractionTime(
    @Req() req: Request,
    @Body(new ValidationPipe())
    updateInteractionTime: updateInteractionTimeDto,
  ) {
    const user = req.user._id;
    return this.interactionService.updateInteractionDuration({
      ...updateInteractionTime,
      user,
    });
  }

  @Post('payment')
  async interactionPayment(
    @Req() req: Request,
    @Body(new ValidationPipe()) interactionPayment: InteractionPaymentDto,
  ) {
    interactionPayment.userId = req.user._id;
    return this.interactionService.interactionPayment(interactionPayment);
  }

  @Post('finish-interaction')
  async finishInteraction(
    @Req() req: Request,
    @Body() body: FinishInteractionDto,
  ) {
    body = { ...body, initiator: req.user._id };
    await this.interactionService.finishInteraction(body);
  }

  @Post('rate-interaction')
  async rateInteraction(@Req() req: Request, @Body() body: RateInteractionDto) {
    body = { ...body, initiator: req.user._id };
    await this.interactionService.rateInteraction(body);
  }
}
