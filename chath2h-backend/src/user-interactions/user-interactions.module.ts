import { Module } from '@nestjs/common';
import { UserInteractionsService } from './user-interactions.service';
import { UserInteractionsController } from './user-interactions.controller';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  controllers: [UserInteractionsController],
  providers: [UserInteractionsService],
  imports: [ChatModule],
})
export class UserInteractionsModule {}
