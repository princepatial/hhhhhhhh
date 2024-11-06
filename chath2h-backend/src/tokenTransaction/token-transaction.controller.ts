import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
  UseGuards,
  ValidationPipe,
  Body,
  Post,
} from '@nestjs/common';
import { TokenTransactionService } from './token-transaction.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { GetTransactionsDto } from './dto/get-transcations.dto';
import { GenerateTransactionTokens } from './dto/generateTransactionTokens.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { createReadStream, unlinkSync } from 'fs';
import { join } from 'path';
import { GrantTokensDto } from './dto/grant-tokens.dto';
import { TokenTransactionCreateDto } from './dto/token-transaction-create.dto';
import { TokenTransactionType } from './entities/token-transaction-type';
import { exportWordCsvController } from 'src/utils/exportWordCsv';
import { TokenTransactionFee } from './entities/token-transaction-fee';
import { TokenTransactionStatus } from './entities/token-transaction-status';

@ApiTags('token-transaction')
@Controller('token-transaction')
export class TokenTransactionController {
  constructor(
    private readonly tokenTransactionService: TokenTransactionService,
  ) {}

  @Get(':skip/:limit/:type?')
  async getTransactions(
    @Req() req: Request,
    @Param('skip') skip: number,
    @Param('limit') limit: number,
    @Param('type') type: string,
  ) {
    return this.tokenTransactionService.getTransactions(
      new GetTransactionsDto({
        limit,
        skip,
        user: req.user._id,
        type: type,
      }),
    );
  }

  @Get('/balance')
  async getUserBalance(@Req() req: Request) {
    return this.tokenTransactionService.getUserBalance(req.user._id);
  }

  @UseGuards(AdminGuard)
  @Get('/generate')
  async getTokensTransactions(
    @Res() res: Response,
    @Query(new ValidationPipe({ transform: true }))
    query: GenerateTransactionTokens,
  ) {
    const options = {
      isExcel: query?.isExcel,
      fromDate: query?.fromDate,
      toDate: query?.toDate,
    };
    const tokenListFile =
      await this.tokenTransactionService.generateTransactionTokens(options);

    return exportWordCsvController(res, tokenListFile, query?.isExcel);
  }

  @Post('grant-tokens')
  async grantTokens(@Req() req: Request, @Body() body: GrantTokensDto) {
    return this.tokenTransactionService.createTransaction(
      new TokenTransactionCreateDto({
        amount: body.amount,
        recipient: body.id,
        type: TokenTransactionType.ADMIN_GRANTED,
        fee: TokenTransactionFee.DISABLED,
        status: TokenTransactionStatus.SUCCEDED,
      }),
    );
  }
}
