import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class InteractionRequestUser {
  constructor(user: string, interactionRequestId: string, socketId?: string) {
    this.interactionRequestId = interactionRequestId;
    this.user = user;
    this.socketId = socketId;
  }
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  interactionRequestId: string;
  @IsOptional()
  @IsString()
  socketId: string;
}
