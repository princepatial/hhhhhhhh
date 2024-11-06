import { Injectable, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { wsAuthGuard } from './wsAuth.guard';
import { Session } from 'express-session';
import { OnEvent } from '@nestjs/event-emitter';
import { OnlineUser } from './online-user';
import BrokerMessageWrapper from 'src/communication/transport/broker.message';
import { RequestMessage } from 'src/communication/transport/message.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import UserOnlineRequest from 'src/chat/dto/user-online.request';
import OnlineUsersCollection from './online-users';
import InteractionService from 'src/chat/services/interaction.service';
import InteractionUserSocket from 'src/chat/dto/interaction-socket.dto ';
import ChatMessageService from 'src/chat/services/chat-message.service';
import ChatMessageDto from 'src/chat/dto/chat-message.dto';
import InteractionRequestService from 'src/chat/services/interaction-request.service';
declare module 'http' {
  interface IncomingMessage {
    session: Session;
    isAuthenticated(): boolean;
    user?: {
      _id: string;
    };
  }
}
@WebSocketGateway()
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly interactionService: InteractionService,
    private readonly messageService: ChatMessageService,
    private readonly interactionRequestService: InteractionRequestService,
  ) {}

  private onlineUsers = new OnlineUsersCollection();

  async handleConnection(client: Socket) {
    console.log("connect");

    const userId = client.request.user._id.toString();
    if (userId) {
      this.onlineUsers.set(new OnlineUser(client, 'Online', userId));
      this.broadcastUserList();
    }
  }

  handleDisconnect(client: Socket) {
    console.log("disconnect");
    const userId = client.request.user._id.toString();
    if (userId) {
      this.onlineUsers.delete(userId, client.id);
      this.broadcastUserList();
    }
  }

  @UseGuards(wsAuthGuard)
  @SubscribeMessage('resumeInteraction')
  async resumeInteraction(client: Socket, interactionIds: string) {
    const userId = client.request.user._id.toString();
    const { interactionId } = JSON.parse(interactionIds);
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });
      await this.interactionService.resumeInteraction(
        new InteractionUserSocket(userId, client.id, interactionId),
      );
    }
  }

  //called when users want to prolongate chat
  @UseGuards(wsAuthGuard)
  @SubscribeMessage('rejoinInteraction')
  async setUserRejoinInteraction(client: Socket, interactionIds: string) {
    const userId = client.request.user._id.toString();
    const { interactionId, interactionRequestId } = JSON.parse(interactionIds);
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });
      if (interactionRequestId)
        await this.interactionRequestService.setUpdateTime(
          interactionRequestId,
          new Date(),
        );
      if (interactionId)
        await this.interactionService.rejoinInteraction(
          new InteractionUserSocket(userId, client.id, interactionId),
        );
    }
  }

  //called from frontend when users is joining to chat (InteractionRequest is accepted by one party)
  @UseGuards(wsAuthGuard)
  @SubscribeMessage('joinInteraction')
  setUserInInteraction(client: Socket, interactionId: string) {
    const userId = client.request.user._id.toString();
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });

      this.interactionService.joinInteraction(
        new InteractionUserSocket(userId, client.id, interactionId),
      );
    }
  }

  @UseGuards(wsAuthGuard)
  @SubscribeMessage('pauseInteraction')
  pauseUserInteraction(client: Socket, interactionId: string) {
    const userId = client.request.user._id.toString();
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });
      this.interactionService.pauseInteraction(
        new InteractionUserSocket(userId, client.id, interactionId),
      );
    }
  }

  //triggered as the user runs out of time
  @UseGuards(wsAuthGuard)
  @SubscribeMessage('preFinishInteraction')
  finishInteraction(client: Socket, interactionId: string) {
    const userId = client.request.user._id.toString();
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });
      this.interactionService.preFinishInteraction(
        new InteractionUserSocket(userId, client.id, interactionId),
      );
    }
  }

  handleInteractionSocketDisconnect(socket: Socket) {
    const userId = socket.request.user._id.toString();
    this.interactionService.leaveInteraction(
      new InteractionUserSocket(userId, socket.id),
    );
  }

  @UseGuards(wsAuthGuard)
  @SubscribeMessage('setStatus')
  setStatus(client: Socket, status: string) {
    const userId = client.request.user._id.toString();
    if (userId) {
      this.onlineUsers.set(new OnlineUser(client, status, userId));
      this.broadcastUserList();
    }
  }

  @UseGuards(wsAuthGuard)
  @SubscribeMessage('getOnlineUsers')
  getOnlineUsers(client: Socket) {
    client.emit('onlineUsers', this.onlineUsers.getOnlineUsers());
  }

  private broadcastUserList() {
    this.server.emit('onlineUsers', this.onlineUsers.getOnlineUsers());
  }

  @UseGuards(wsAuthGuard)
  @SubscribeMessage('sendMessage')
  handleUserMessage(client: Socket, payload: ChatMessageDto) {
    const userId = client.request.user._id.toString();
    if (userId) {
      client.on('disconnect', () => {
        this.handleInteractionSocketDisconnect(client);
      });
      payload.from = userId;
      this.messageService.sendMessage(payload);
    }
  }

  /****** Event handlers ******** */
  @OnEvent('socket.*')
  handleBrokerSocketMessage(payload: BrokerMessageWrapper<RequestMessage>) {
    if (Array.isArray(payload.recipient)) {
      (payload.recipient as string[]).forEach((r: string) => {
        this.sendBrokerMessage(this.onlineUsers.get(r), payload);
      });
    } else {
      this.sendBrokerMessage(
        this.onlineUsers.get(payload.recipient as string),
        payload,
      );
    }
  }

  @OnEvent('internal.UserOnlineRequest')
  handleBrokerUsersMessage(payload: BrokerMessageWrapper<UserOnlineRequest>) {
    this.eventEmitter.emit(payload.responseChannel, {
      isOnline: this.onlineUsers?.get(payload.message.user) != null,
    });
  }

  private sendBrokerMessage(
    onlineUser: OnlineUser | OnlineUser[],
    payload: BrokerMessageWrapper<RequestMessage>,
  ) {
    if (!onlineUser) return;
    const users = Array.isArray(onlineUser) ? onlineUser : [onlineUser];
    users.forEach((u) => {
      const client = u.client;
      if (client) {
        client.emit(payload.channelBase(), payload.message);
      }
    });
  }
}
