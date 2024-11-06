import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import BaseWatcher from './base.watcher';
import InteractionWatcher from './interaction-time.watcher';

@Injectable()
export default class WatchersBundle implements OnModuleInit {
  public static WATHERS_BUNDLE_KEY = 'watchers_bundle';
  constructor(
    @Inject(WatchersBundle.WATHERS_BUNDLE_KEY)
    private readonly watchers: BaseWatcher[],
  ) {}
  onModuleInit() {
    if (this.watchers) {
      this.watchers.forEach((w) => w.watch());
    }
  }
}
