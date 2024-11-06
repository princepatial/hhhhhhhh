import BaseWatcher from "src/chat/watchers/base.watcher";
import { TokenTransactionService } from "../../tokenTransaction/token-transaction.service";
import { RunnableTask } from "src/runnableTask/runnable-task";
import { RunnableTaskSchedule } from "src/runnableTask/dto/runnable-task-schedule";
import { Injectable } from "@nestjs/common";
@Injectable()
export default class TokenTransactionTransferWatcher extends BaseWatcher {
    constructor(
        private readonly tokenTransactionService: TokenTransactionService,
        private readonly runnableTask: RunnableTask,
      ) {
        super();
      }

      public override watch(): void {
        this.runnableTask.run(
          [RunnableTaskSchedule.SECOND, 1],
          'TokenTransactionTransfer',
          () => this.execWatch(this.tokenTransactionService),
        );
      }

      private execWatch(tokenTransactionService: TokenTransactionService) {
        try {
            tokenTransactionService.getToTransfer().then((transactions) => {
                transactions.forEach(async t=>{
                    await tokenTransactionService.transferAndFinalize(t);
                });
          });
        } catch (err) {
          console.error(
            'Error occured while executing watch function for watcher TokenTransactionTransfer' +
              err,
          );
        }
      }
}