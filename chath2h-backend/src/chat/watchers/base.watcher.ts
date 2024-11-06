import { Injectable } from '@nestjs/common';

@Injectable()
export default class BaseWatcher {
  public watch() {
    console.info('Base watcher started');
  }
}
