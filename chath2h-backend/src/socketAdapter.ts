import { ForbiddenException, INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NextFunction } from 'express';
import { sharedSessionMiddleware } from './sharedSessionMiddleware';
import { ServerOptions, Socket } from 'socket.io';
import * as passport from 'passport';
import { Settings } from './settings';

export class SocketIoAdapter extends IoAdapter {
  constructor(app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    console.info("PORT:"+port);
    const cors = {
      origin: [
        Settings.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'https://piehost.com'
      ],
      credentials: true,
    };

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
      path: '/api/socket.io',
    };
    const server = super.createIOServer(port, optionsWithCORS);

    const wrap = (middleware: any) => (socket: Socket, next: NextFunction) =>
      middleware(socket.request, {}, next);

    server.use(wrap(sharedSessionMiddleware));
    server.use(wrap(passport.initialize()));
    server.use(wrap(passport.session()));
    server.use((socket: Socket, next: NextFunction) => {
      if (socket.request.isAuthenticated()) {
        next();
      } else {
        next(new ForbiddenException('User not authenticated'));
      }
    });

    return server;
  }
}
