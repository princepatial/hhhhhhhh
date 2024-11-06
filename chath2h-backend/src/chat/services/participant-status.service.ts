import { Injectable } from '@nestjs/common';
import MessageBrokerService from 'src/communication/broker/broker.service';
import UserOnlineRequest from '../dto/user-online.request';
import UserOnlineResponse from '../dto/user-online.response';

@Injectable()
export class ParticipantStatusService {
  constructor(private readonly messageBroker: MessageBrokerService) {}

  public async isOnline(user: string): Promise<boolean> {
    const result: UserOnlineResponse =
      await this.messageBroker.sendWithResponse(new UserOnlineRequest(user));
    return result.isOnline;
  }
}
