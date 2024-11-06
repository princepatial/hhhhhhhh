import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Authless } from './decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Authless()
  @Get('settings')
  getSettings() {
    //TODO: add some dto?
    const { INACTIVITY_TIMEOUT } = this.appService.getSettings();
    return { INACTIVITY_TIMEOUT };
  }

  @Authless()
  @Get('h2hToken')
  getH2HToken() {
    const {
      H2H_TOKEN_ADDRESS,
      H2H_TOKEN_ADMIN_WALLET_ADDRESS,
      H2H_TOKEN_STARTING_AMOUNT,
    } = this.appService.getSettings();

    return {
      address: H2H_TOKEN_ADDRESS,
      adminWalletAddress: H2H_TOKEN_ADMIN_WALLET_ADDRESS,
      startingAmount: H2H_TOKEN_STARTING_AMOUNT,
    };
  }
}
