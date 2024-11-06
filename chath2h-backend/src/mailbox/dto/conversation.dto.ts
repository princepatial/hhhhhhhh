import { IsPositive, IsString } from 'class-validator';

export class ConversationDto {
  @IsString()
  need: string;

  @IsString()
  coachOffer: string;
  messages: string[];

  @IsString()
  participant1: string;

  @IsString()
  participant2: string;

  @IsString()
  owner: string;

  @IsPositive()
  messagesLimit: number;
  participantsLimits: Map<string, number> = new Map();
}
