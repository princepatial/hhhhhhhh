import { Injectable } from '@nestjs/common';
import BaseWatcher from './base.watcher';
import { RunnableTask } from 'src/runnableTask/runnable-task';
import MessageBrokerService from 'src/communication/broker/broker.service';
import InteractionTimeRequest from '../dto/interaction-time.request';
import { RunnableTaskSchedule } from 'src/runnableTask/dto/runnable-task-schedule';
import InteractionService from '../services/interaction.service';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
@Injectable()
export default class InteractionTimeWatcher extends BaseWatcher {
  constructor(
    private readonly interactionService: InteractionService,
    private readonly runnableTask: RunnableTask,
    private readonly messageBroker: MessageBrokerService,
  ) {
    super();
  }

  public override watch(): void {
    this.runnableTask.run(
      [RunnableTaskSchedule.MINUTE, 1],
      'UpdateInteractionTime',
      () => this.execWatch(this.interactionService),
    );
  }

  private execWatch(interactionService: InteractionService) {
    try {
      interactionService.getInProgress().then((interactions) => {
        interactions.forEach((i) => {
          const duration: number =
            (new Date().getTime() - i.createdAt.getTime()) / (1000 * 60);
          this.messageBroker.send(
            new InteractionTimeRequest(new MessageRecipient().add(i.coach._id.toString()).add(i.user._id.toString()),
            i._id, duration),
          );
        });
      });
    } catch (err) {
      console.error(
        'Error occured while executing watch function for watcher InteractionTimeWatcher' +
          err,
      );
    }
  }
}
