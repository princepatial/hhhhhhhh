import BaseWatcher from "src/chat/watchers/base.watcher";
import { TokenTransactionService } from "../../tokenTransaction/token-transaction.service";
import { RunnableTask } from "src/runnableTask/runnable-task";
import { RunnableTaskSchedule } from "src/runnableTask/dto/runnable-task-schedule";
import { Injectable } from "@nestjs/common";
/**
 * Look for outdated free tokens transaction and clear balance of this tokens for user
 */
@Injectable()
export default class TokenTransactionOutdatedFreeTokensWatcher extends BaseWatcher {
    constructor(
        private readonly tokenTransactionService: TokenTransactionService,
        private readonly runnableTask: RunnableTask,
      ) {
        super();
      }

      public override watch(): void {
        this.runnableTask.run(
          [RunnableTaskSchedule.SECOND, 15],
          'TokenTransactionOutdatedFreeTokens',
          async () => await this.execWatch(this.tokenTransactionService),
        );
      }

      private async execWatch(tokenTransactionService: TokenTransactionService) {
        try {
            await  tokenTransactionService.clearOutdatedFreeTokens();
        } catch (err) {
          console.error(
            'Error occured while executing watch function for watcher TokenTransactionOutdatedFreeTokens' +
              err,
          );
        }
      }
}