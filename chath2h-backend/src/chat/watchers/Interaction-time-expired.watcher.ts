import { RunnableTask } from 'src/runnableTask/runnable-task';
import BaseWatcher from './base.watcher';
import { RunnableTaskSchedule } from 'src/runnableTask/dto/runnable-task-schedule';
import InteractionRequestService from '../services/interaction-request.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class InteractionTimeExpired extends BaseWatcher {
  constructor(
    private readonly runnableTask: RunnableTask,
    private readonly interactionRequest: InteractionRequestService,
  ) {
    super();
  }
  public override watch() {
    this.runnableTask.run(
      [RunnableTaskSchedule.SECOND, 5],
      'updateInteractionTimeExpired',
      () => this.execWatch(this.interactionRequest),
    );
  }

  private async execWatch(interactionRequest: InteractionRequestService) {
    try {
      await interactionRequest.closeExpiredRequests();
    } catch (err) {
      console.error(
        'Error occured while executing watch function for watcher InteractionTimeExpiredWatcher' +
          err,
      );
    }
  }
}
