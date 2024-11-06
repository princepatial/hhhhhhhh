import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class InteractionUserSocket {
  constructor(user: string, socketId: string, interactionId: string = null) {
    this.socketId = socketId;
    this.user = user;
    this.interactionId = interactionId;
  }
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  socketId: string;
  @IsString()
  @IsOptional()
  interactionId: string;
}
