import { Injectable } from '@nestjs/common';

import { EventEmitter2 } from '@nestjs/event-emitter';
import BrokerMessageWrapper from '../transport/broker.message';
import { RequestMessage } from '../transport/message.interfaces';

@Injectable()
export default class MessageBrokerService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  public send<T extends RequestMessage>(
    message: NonNullable<T>,
    channel: string = null,
  ) {
    const msg = new BrokerMessageWrapper(message, channel);
    this.eventEmitter.emit(msg.channel, msg);
  }

  public async sendWithResponse<T extends RequestMessage, K>(
    message: NonNullable<T>,
    channel: string = null,
  ): Promise<K> {
    const msg = new BrokerMessageWrapper(message, channel);
    const result: Promise<K> = new Promise((resolve) => {
      return this.eventEmitter.once(msg.responseChannel, resolve);
    });
    this.eventEmitter.emit(msg.channel, msg);

    return result;
  }
}
