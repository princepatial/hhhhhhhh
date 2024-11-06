import { MessageRecipient } from './message-recipient';

export interface RequestMessage {
  channelPrefix: string;
  channelPostfix: string;
}

export interface SocketRequestMessage extends RequestMessage {
  recipient: MessageRecipient;
}
