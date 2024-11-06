import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InteractionOnchainTokenTransferStatus } from './interaction-onchain-token-transfer-status.enum';
import { InteractionStatus } from './interaction-status.enum';

export class InteractionDto {
  public constructor(init?: Partial<InteractionDto>) {
    Object.assign(this, init);
  }

  @IsString()
  @IsNotEmpty()
  user: string;
  @IsString()
  @IsNotEmpty()
  coach: string;
  @IsString()
  @IsOptional()
  need?: string;
  @IsString()
  @IsOptional()
  coachOffer?: string;
  status: InteractionStatus;
  onchainTokenStatus: InteractionOnchainTokenTransferStatus;
  @IsString()
  @IsNotEmpty()
  transaction: string;
}
export type InteractionDtoKeys = keyof InteractionDto;
