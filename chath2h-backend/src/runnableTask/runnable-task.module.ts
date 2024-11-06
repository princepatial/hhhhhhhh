import { Module } from '@nestjs/common';
import { RunnableTask } from './runnable-task';

@Module({
  providers: [RunnableTask],
})
export class RunnableTaskModule {}
