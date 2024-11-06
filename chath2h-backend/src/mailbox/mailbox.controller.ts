import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserGuard } from 'src/guards/user.guard';
import { MessageDto } from './dto/message.dto';
import { MailboxService } from './mailbox.service';

@ApiTags('mailbox')
@Controller('mailbox')
@UseGuards(UserGuard)
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Post()
  async send(
    @Req() req: Request,
    @Body(new ValidationPipe()) message: MessageDto,
  ) {
    message.from = req.user._id;
    return this.mailboxService.send(message);
  }

  @Patch('viewed/:id')
  async updateViewedMessage(@Req() req: Request, @Param('id') id: string) {
    return await this.mailboxService.updateViewedMessage(req.user._id, id);
  }

  @Get('unread-messages-count')
  async getUnreadMessagesCount(@Req() req: Request) {
    return await this.mailboxService.getUnreadMessagesCount(req.user._id);
  }

  @Get()
  async getMessages(@Req() req: Request) {
    return this.mailboxService.getConversations(req.user._id.toString());
  }

  @Delete(':id')
  async deleteConversation(@Req() req: Request, @Param('id') id: string) {
    return this.mailboxService.deleteConversation(req.user._id, id);
  }
}
