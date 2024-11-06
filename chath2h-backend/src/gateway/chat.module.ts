import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketGateway } from './gateway';
import { wsAuthGuard } from './wsAuth.guard';
import { ChatModule as InteractionModule } from 'src/chat/chat.module';
@Module({
  imports: [AuthModule, InteractionModule, ChatModule],
  providers: [SocketGateway, wsAuthGuard],
})
export class ChatModule {}
