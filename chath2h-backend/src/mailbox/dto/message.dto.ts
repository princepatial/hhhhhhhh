import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ConversationContext } from './conversation-context';
export class MessageDto {
  public constructor(init?: Partial<MessageDto>) {
    Object.assign(this, init);
  }

  @IsString()
  @IsOptional()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(400)
  content: string;

  conversationContext: ConversationContext;

  @IsNotEmpty()
  @IsString()
  conversationContextId: string;

  @IsOptional()
  @IsBoolean()
  systemMessage: boolean;
}
