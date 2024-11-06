import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { UserInteractionsService } from './user-interactions.service';
import { Request } from 'express';

@Controller('user-interactions')
export class UserInteractionsController {
  constructor(
    private readonly userInteractionsService: UserInteractionsService,
  ) {}

  @Get('/single-need-offer/:needOrOfferId')
  findNeedInteractions(
    @Req() req: Request,
    @Param('needOrOfferId') needOrOffer: string,
  ) {
    const user = req.user._id.toString();
    return this.userInteractionsService.findAllNeedOfferInteractions(
      user,
      needOrOffer,
    );
  }

  @Get('/chatHistory/:needOffer/:recipient')
  findNeedConversation(
    @Req() req: Request,
    @Param('needOffer') needOffer: string,
    @Param('recipient') recipient: string,
  ) {
    const user = req.user._id.toString();
    return this.userInteractionsService.findNeedConversation(
      needOffer,
      user,
      recipient,
    );
  }

  @Get('/chats')
  findUserInteractions(@Req() req: Request) {
    const user = req.user._id.toString();
    return this.userInteractionsService.findUserInteractions(user);
  }
}
