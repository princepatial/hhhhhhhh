import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import SocketRequestBase from 'src/communication/transport/socket-request.base';

export default class InteractionPausedRequest extends SocketRequestBase {
  constructor(
    recipient: MessageRecipient,
    interactionId: string,
    pauseInitiatorSocketId: string,
    initiatorName: string,
  ) {
    super(recipient);
    this.interactionId = interactionId;
    this.pauseInitiatorSocketId = pauseInitiatorSocketId;
    this.initiatorName = initiatorName;
  }
  @IsString()
  @IsNotEmpty()
  interactionId: string;

  @IsString()
  @IsNotEmpty()
  pauseInitiatorSocketId: string;

  @IsString()
  @IsOptional()
  initiatorName;
}
