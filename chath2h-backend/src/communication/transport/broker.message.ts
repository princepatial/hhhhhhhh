import { RequestMessage, SocketRequestMessage } from './message.interfaces';

export default class BrokerMessageWrapper<T extends RequestMessage> {
  constructor(message: NonNullable<T>, channel?: string) {
    this.message = message;
    this.recipient = this.buildRecipient();
    this.channel = channel || this.buildChannel();
    this.responseChannel = `${this.channel}.${this.message.channelPostfix}`;
  }
  message: T;
  recipient: string | string[];
  channel: string;
  responseChannel: string;

  private buildRecipient(): string | string[] {
    const recipientRaw = (this.message as unknown as SocketRequestMessage)
      ?.recipient;
    return recipientRaw.build();
  }

  private buildChannel(): string {
    return `${this.message.channelPrefix}.${this.message.constructor.name}`;
  }

  public channelBase(): string {
    return this.channel.replace(`${this.message.channelPrefix}.`, '');
  }
}
