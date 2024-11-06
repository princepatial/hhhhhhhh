import { Injectable } from '@nestjs/common';
import { TokenTransaction } from './entities/token-transaction';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletInstance } from 'src/utils/onchain/walletInstance';
import { TokenTransactionStatus } from './entities/token-transaction-status';
import { TokenTransactionType } from './entities/token-transaction-type';
import { TokenTransactionService } from './token-transaction.service';
import TokenTransactionInfo from './dto/token-transaction-info.dto';
import { Settings } from 'src/settings';

@Injectable()
export class TokenTransactionOnchainService {
  private readonly wallet = new WalletInstance();

  constructor(
    @InjectModel(TokenTransaction.name)
    private readonly tokenTransactionModel: Model<TokenTransaction>,
    private readonly tokenTransactionService: TokenTransactionService
  ) { }

  private async transfer(fromAddress: string, toAddress: string, amount: number) {
    const readyToTransfer = await this.wallet.willTransferFromPass(fromAddress, toAddress, amount);
    if (readyToTransfer) {
      await this.wallet.transferFrom(fromAddress, toAddress, amount);
    }
    return readyToTransfer;
  }

  public async completeOnchainTransactions() {
    const transactions = await this.getNotCompletedOnchainTransactions();

    for (const transaction of transactions) {
      try {
        if (transaction.recipient.walletAddress) {
          const tokenTransactionInfo: TokenTransactionInfo = this.tokenTransactionService.buildTokenTransferInfo(transaction);

          const senderWallet = transaction.sender ? (transaction.sender.walletAddress ?  transaction.sender.walletAddress : Settings.H2H_TOKEN_ADMIN_WALLET_ADDRESS) 
          : Settings.H2H_TOKEN_ADMIN_WALLET_ADDRESS;
          //transfer on-chain tokens from user (or admin if user does not have wallet) to coach
          if(tokenTransactionInfo.onChainTokensFromUserToCoach > 0){
            await this.transfer(senderWallet,
              transaction.recipient.walletAddress, tokenTransactionInfo.onChainTokensFromUserToCoach);
          }
          // transfer on-chain free tokens equivalent from admin to users
          if(tokenTransactionInfo.onChainTokensFromAdminToCoach > 0){
            await this.transfer(Settings.H2H_TOKEN_ADMIN_WALLET_ADDRESS, transaction.recipient.walletAddress, tokenTransactionInfo.onChainTokensFromAdminToCoach);
          }

          if (transaction.sender?.walletAddress && tokenTransactionInfo.onChainFee > 0) {
            //send fee from user to admin
            await this.transfer(transaction.sender.walletAddress, Settings.H2H_TOKEN_ADMIN_WALLET_ADDRESS, tokenTransactionInfo.onChainFee);
          }
          transaction.tokensTransferredOnchain = true;
        }
        transaction.status = TokenTransactionStatus.SUCCEDED;
        await transaction.save();

      } catch (err) {
        console.error(
        `Error occured while H2H token onchain to coach: ${transaction.recipient._id.toString()} transfering, error: ${err}` +
          err,
        );
      }
    };
  }

  private async getNotCompletedOnchainTransactions() {
    return await this.tokenTransactionModel
      .find({
        tokensTransferredOnchain: false,
        status: TokenTransactionStatus.TO_TRANSFER_TOKENS_ONCHAIN
      })
      .populate([
        { path: 'sender', select: 'walletAddress' },
        { path: 'recipient', select: 'walletAddress' },
      ])
      .exec();
  }
}
