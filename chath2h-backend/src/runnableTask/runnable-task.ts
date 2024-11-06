import { Injectable } from '@nestjs/common';
import { RunnableTaskSchedule } from './dto/runnable-task-schedule';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
/*Usage:
    1. Inject RunnableTask service to service where will be used 
    2. Example code: 

    private  test(){
            console.log("cron");
    }

    this.runnableTask.run([RunnableTaskSchedule.SECOND, 2], 'test',this.test); // run function 'test' every two seconds

*/

@Injectable()
export class RunnableTask {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}
  private static _lock = new Map<string, boolean>();
  public async run(
    schedule: [RunnableTaskSchedule, number],
    name: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    func: Function,
  ) {
    try {
      const patterm = this.scheduleString(schedule);
      const job = new CronJob(patterm, async() => 
      {
        if(RunnableTask._lock.get(name)) {
          return;
        };
        RunnableTask._lock.set(name, true);
        await func();
        RunnableTask._lock.set(name, false);
      });
      this.schedulerRegistry.addCronJob(name, job);
      job.start();
      console.info(`Runnable task ${name} registered`);
    } catch (err) {
      console.error(`Unable to start runnable task ${name}` + err);
    }
  }

  private scheduleString(schedule: [RunnableTaskSchedule, number]): string {
    const replacement = schedule[1].toString();
    const idx = schedule[0] == 0 ? schedule[0] : schedule[0] * 2 + 1;
    let result = '* * * * * *';
    const source = '* * * * * *';
    for (let i = 0; i < idx; i += 2) {
      result = result.slice(0, i) + '0' + source.slice(idx, source.length);
    }
    return (
      result.slice(0, idx == 0 ? 1 : idx) +
      '/' +
      replacement +
      result.slice(idx == 0 ? 1 : idx, result.length)
    );
  }
}
