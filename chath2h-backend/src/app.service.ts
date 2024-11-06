import { Injectable } from '@nestjs/common';
import { ISettings } from './types/interface.Settings';
import { Settings } from './settings';

@Injectable()
export class AppService {
  getSettings(): ISettings {
    return Settings;
  }
}
