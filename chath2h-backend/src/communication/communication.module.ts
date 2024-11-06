import { Module } from '@nestjs/common';
import MessageBrokerService from './broker/broker.service';

@Module({
  providers: [MessageBrokerService],
})
export class CommunicationModule {}
