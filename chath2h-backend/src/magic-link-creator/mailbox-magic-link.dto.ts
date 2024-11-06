import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MailboxMagicLinkDto {
  constructor(recipient: string, redirectContext?: string) {
    this.recipient = recipient;
    this.redirectContext = redirectContext;
  }

  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsString()
  @IsOptional()
  redirectContext: string;
}
