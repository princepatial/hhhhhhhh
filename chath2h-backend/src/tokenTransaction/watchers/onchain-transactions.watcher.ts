import { RunnableTask } from 'src/runnableTask/runnable-task';
import BaseWatcher from '../../chat/watchers/base.watcher';
import { RunnableTaskSchedule } from 'src/runnableTask/dto/runnable-task-schedule';
import { TokenTransactionOnchainService } from 'src/tokenTransaction/token-transaction-onchain.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class OnchainTransactionsWatcher extends BaseWatcher {
  constructor(
    private readonly runnableTask: RunnableTask,
    private readonly tokenTransactionOnchainService: TokenTransactionOnchainService,
  ) {
    super();
  }
  public override watch() {
    this.runnableTask.run(
      [RunnableTaskSchedule.SECOND, 1],
      'CompleteOnchainTransactions',
      async () => await this.execWatch(this.tokenTransactionOnchainService),
    );
  }

  private async execWatch(tokenTransactionOnchainService: TokenTransactionOnchainService) {
    try {
      await tokenTransactionOnchainService.completeOnchainTransactions();
    } catch (err) {
      console.error(
        'Error occured while executing watch function for watcher OnchainTransactionsWatcher' +
          err,
      );
    }
  }

}
