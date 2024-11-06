import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenTransactionDto } from './dto/token-transaction.dto';
import { TokenTransaction } from './entities/token-transaction';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetTransactionsDto } from './dto/get-transcations.dto';
import { User } from 'src/users/entities/user.entity';
import { TokenTransactionKind } from './entities/token-transaction-kind';
import { TokenTransactionCreateDto } from './dto/token-transaction-create.dto';
import { TokenTransactionUpdateDto } from './dto/token-transaction-update.dto';
import { TokenTransactionBase } from './dto/token-transaction.base';
import { TokenTransactionsPaginateDto } from './dto/token-transactions-paginate.dto';
import { Settings } from 'src/settings';
import { TokenTransactionType } from './entities/token-transaction-type';
import { TokenTransactionStatus } from './entities/token-transaction-status';
import { TokenTransactionFee } from './entities/token-transaction-fee';
import { Interaction } from 'src/chat/entities/interaction.entity';
import MessageBrokerService from 'src/communication/broker/broker.service';
import UserBalanceRequest from 'src/chat/dto/user-balance.request';
import { MessageRecipient } from 'src/communication/transport/message-recipient';
import { Payment } from 'src/payment/entities/payment.entity';
import { GenerateTransactionTokens } from './dto/generateTransactionTokens.dto';
import { exportWordCsvService } from 'src/utils/exportWordCsv';
import { PaymentStatus } from 'src/payment/entities/payment-status';
import TokenTransactionInfo from './dto/token-transaction-info.dto';

@Injectable()
export class TokenTransactionService {
  constructor(
    @InjectModel(TokenTransaction.name)
    private readonly tokenTransactionModel: Model<TokenTransaction>,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<Interaction>,
    private readonly messageBroker: MessageBrokerService,
  ) { }

  private readonly FREE_TOKENS_TRANSACTIONS: TokenTransactionType[] = [
    TokenTransactionType.ADMIN_GRANTED,
    TokenTransactionType.NEW_USER,
    TokenTransactionType.REF_LINK,
    TokenTransactionType.OUTDATED_FREE,
  ];

  public async createTransaction(
    tokenTransaction: TokenTransactionCreateDto,
  ): Promise<TokenTransaction> {
    if (
      tokenTransaction.status == TokenTransactionStatus.SUCCEDED &&
      tokenTransaction.fee != TokenTransactionFee.ENABLED
    ) {
      await this.transfer(tokenTransaction);
    }
    return this.tokenTransactionModel.create(tokenTransaction);
  }

  /*
    Increase amount of transaction and make correspoinding transfer from sender to recipient.
     Should be used during chat when user is paying per minute
     */
  public async increaseTransactionAmount(
    tokenTransactionUpdate: TokenTransactionUpdateDto,
  ) {
    const transaction = await this.tokenTransactionModel.findById(
      tokenTransactionUpdate.id,
    );
    if (transaction.status != TokenTransactionStatus.OPEN) {
      throw new BadRequestException(
        `Unable to increase transaction amount. Transaction ${transaction._id} is not in required OPEN status`,
      );
    }
    this.debit(tokenTransactionUpdate.sender, tokenTransactionUpdate.amount);
    const freeAmount = await this.debitFree(
      tokenTransactionUpdate.sender,
      tokenTransactionUpdate.amount,
    );
    transaction.amount += tokenTransactionUpdate.amount;
    if (!transaction.freeAmount) {
      transaction.freeAmount = freeAmount;
    } else {
      transaction.freeAmount += freeAmount;
    }
    transaction.save();
  }

  public async getTransactions(
    getTransactionsDto: GetTransactionsDto,
  ): Promise<TokenTransactionsPaginateDto> {
    const [transactions, { totalPages, hasNextPage, skip }] = await Promise.all(
      [
        this.tokenTransactions(getTransactionsDto),
        this.getTokenTransactionsMeta(getTransactionsDto),
      ],
    );
    const expectedChatKind = getTransactionsDto.type
      ? getTransactionsDto.type.indexOf('SPENT') >= 0
        ? TokenTransactionKind.DEBIT
        : (getTransactionsDto.type == TokenTransactionType.OUTDATED_FREE ? TokenTransactionKind.DEBIT :  TokenTransactionKind.CREDIT)
      : null;

    const docs: TokenTransactionDto[] = [];

    transactions.forEach((t) => {
      const kind = this.getKind(getTransactionsDto.user, t);
      if (expectedChatKind && expectedChatKind != kind) return;

      docs.push(
        new TokenTransactionDto({
          amount:
            kind == TokenTransactionKind.CREDIT &&
              t.fee == TokenTransactionFee.ENABLED
              ? t.amount - t.feeAmount
              : t.amount,
          kind: kind,
          recipient: t.recipient?._id,
          sender: t.sender?._id,
          type: t.type,
          createdAt: t.createdAt,
        }),
      );
    });

    return { docs, hasNextPage, totalPages, skip };
  }

  public async getUserBalance(user: string): Promise<number> {
    return user ? (await this.userModel.findById(user)).tokens : null;
  }

  private async transfer(tokenTransaction: TokenTransactionBase) {
    await Promise.all([
      this.debit(tokenTransaction.sender, tokenTransaction.amount),
      this.credit(tokenTransaction.recipient, tokenTransaction.amount),
      ...(this.FREE_TOKENS_TRANSACTIONS.indexOf(tokenTransaction.type) > 0
        ? [
          this.creditFree(
            tokenTransaction.recipient,
            tokenTransaction.amount,
          ),
          this.debitFree(tokenTransaction.sender, tokenTransaction.amount),
        ]
        : []), // there is no debt call for free tokens - always 'mintetd' new tokens
    ]);
  }


  private test(tran:TokenTransaction){
    for(let i = 1; i< 51;i++){
      for(let k = 0; k<i+1;k++){
        tran.freeAmount = k;
        tran.amount = i;
        const res = this.buildTokenTransferInfo(tran);
        console.log(`${tran.amount};${tran.freeAmount};${res.fee};${res.onChainFee};${res.onChainTokensFromAdminToCoach};${res.onChainTokensFromUserToCoach};${res.tokensToCoach}`);
      }
    }
  }
  /**
   * Transfer amount - fee to recipient, transfer fee to admin, set status of transaction to SUCCEDED
   * Chat transactions required finalization - stays in status open until chat is in progress, once finished status of transaction
   *  is set to TO_TRANSFER_TOKENS and function is called by TokenTransactionTransferWatcher.
   */
  public async transferAndFinalize(tokenTransaction: TokenTransaction) {
    const tokenTransactionInfo: TokenTransactionInfo =
      this.buildTokenTransferInfo(tokenTransaction);
    await this.credit(
      tokenTransaction.recipient._id.toString(),
      tokenTransactionInfo.tokensToCoach,
    );
    await this.creditAdmin(tokenTransactionInfo.fee);

    tokenTransaction.status = TokenTransactionStatus.TO_TRANSFER_TOKENS_ONCHAIN;
    tokenTransaction.feeAmount = tokenTransactionInfo.fee;
    tokenTransaction.tokensTransferred = true;

    await tokenTransaction.save();

    const balances: Record<string, number> = {
      [tokenTransaction.recipient?._id.toString()]: await this.getUserBalance(
        tokenTransaction.recipient?._id.toString(),
      ),
    };

    const balancesRequest: UserBalanceRequest = new UserBalanceRequest(
      new MessageRecipient().add(tokenTransaction.recipient._id.toString()),
      balances,
    );
    this.messageBroker.send(balancesRequest);
  }

  public buildTokenTransferInfo(
    tokenTransaction: TokenTransaction,
  ): TokenTransactionInfo {
    const fee =
      tokenTransaction.fee == TokenTransactionFee.ENABLED
        ? this.calculateFee(tokenTransaction.amount)
        : 0;
    const freeTokensDiff = tokenTransaction.freeAmount - fee;
    const tokensToCoach = tokenTransaction.amount - fee;
    const onChainTokensFromUserToCoach = tokenTransaction.amount - (freeTokensDiff < 0 ? fee : tokenTransaction.freeAmount); 
    const onChainTokensFromAdminToCoach = freeTokensDiff < 0 ? 0 : freeTokensDiff;
    const onChainFee = freeTokensDiff < 0 ? Math.abs(freeTokensDiff) : 0;

    return new TokenTransactionInfo({
      fee,
      tokensToCoach,
      onChainTokensFromAdminToCoach,
      onChainTokensFromUserToCoach,
      onChainFee,
    });
  }

  private calculateFreeAmount(
    tokenTransaction: TokenTransaction,
    fee: number,
  ): number {
    if (!tokenTransaction.freeAmount) return 0;

    if (tokenTransaction.amount === tokenTransaction.freeAmount) {
      return tokenTransaction.freeAmount - fee;
    }

    return tokenTransaction.freeAmount;
  }

  public calculateFee(amount: number): number {
    if (amount == 0) return 0;
    if (amount == Settings.FREE_OF_FEE_AMOUNT) return 0;
    if (amount <= Settings.MIN_PLATFORM_FIXED_FEE_AMOUNT) {
      return Settings.PLATFORM_FIXED_FEE;
    }
    return Math.round(amount * (Settings.PLATFORM_FEE / 100));
  }

  private async debit(user: string, amount: number) {
    if (!user) return;
    await this.userModel.findByIdAndUpdate(
      { _id: user },
      {
        $inc: { tokens: -amount },
      },
    );
  }

  private async debitFree(user: string, amount: number): Promise<number> {
    if (!user) return;
    const userEntity = await this.userModel.findById(user);
    if (userEntity.freeTokens == 0) {
      return 0;
    } else {
      userEntity.freeTokens -= amount;
      await userEntity.save();
      return amount;
    }
  }

  private async credit(user: string, amount: number) {
    if (!user) return;
    await this.userModel.findByIdAndUpdate(
      { _id: user },
      {
        $inc: { tokens: amount },
      },
    );
  }

  private async creditFree(user: string, amount: number) {
    if (!user) return;
    await this.userModel.findByIdAndUpdate(
      { _id: user },
      {
        $inc: { freeTokens: amount },
      },
    );
  }

  private async creditAdmin(amount: number) {
    if (!amount) return;
    await this.userModel.findOneAndUpdate(
      { email: Settings.ADMIN_EMAIL },
      {
        $inc: { tokens: amount },
      },
    );
  }

  private getKind(
    user: string,
    transaction: TokenTransaction,
  ): TokenTransactionKind {
    if(transaction.type == TokenTransactionType.OUTDATED_FREE) return TokenTransactionKind.DEBIT;
    return transaction.recipient._id.toString() == user
      ? TokenTransactionKind.CREDIT
      : TokenTransactionKind.DEBIT;
  }

  private normalizeTransactionType(type: string | null): string | null {
    if (type && (type.indexOf('SPENT') >= 0 || type.indexOf('EARN') >= 0)) {
      // chat type transaction
      return TokenTransactionType.CHAT;
    }
    return type;
  }

  private tokenTransactions(getTransactionsDto: GetTransactionsDto) {
    return this.tokenTransactionModel
      .find({
        $and: [
          {
            $or: [
              { sender: getTransactionsDto.user },
              { recipient: getTransactionsDto.user },
            ],
          },
          getTransactionsDto.type
            ? { type: this.normalizeTransactionType(getTransactionsDto.type) }
            : {},
          { status: TokenTransactionStatus.SUCCEDED },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(Number(getTransactionsDto.skip))
      .limit(Number(getTransactionsDto.limit))
      .exec();
  }
  private async getTokenTransactionsMeta(
    getTransactionsDto: GetTransactionsDto,
  ) {
    const transactionsCount = await this.tokenTransactionModel
      .count({
        $and: [
          {
            $or: [
              { sender: getTransactionsDto.user },
              { recipient: getTransactionsDto.user },
            ],
          },
          getTransactionsDto.type
            ? { type: this.normalizeTransactionType(getTransactionsDto.type) }
            : {},
          { status: TokenTransactionStatus.SUCCEDED },
        ],
      })
      .lean();

    const skip = Number(getTransactionsDto.skip);
    const limit = Number(getTransactionsDto.limit);
    const totalPages = Math.ceil(
      transactionsCount / Number(getTransactionsDto.limit),
    );
    const hasNextPage = transactionsCount - (skip + limit) > 0;

    return { hasNextPage, totalPages, skip };
  }

  public async getToTransfer(): Promise<TokenTransaction[]> {
    return this.tokenTransactionModel.find({
      $and: [{ status: TokenTransactionStatus.TO_TRANSFER_TOKENS }],
    });
  }

  public async setToTransfer(id: string) {
    const tokenTransaction: TokenTransaction =
      await this.tokenTransactionModel.findById(id);
    if (
      tokenTransaction &&
      tokenTransaction.status == TokenTransactionStatus.OPEN
    ) {
      tokenTransaction.status = TokenTransactionStatus.TO_TRANSFER_TOKENS;
      await tokenTransaction.save();
    }
  }

  public async clearOutdatedFreeTokens(): Promise<void> {
    const priorDate = new Date(new Date().setDate(new Date().getDate() - Settings.OUTDATED_TOKENS_DAYS));
    let freeTokensBalanceGroup = await this.tokenTransactionModel.aggregate([
      {
        $match: {
          $and: [
            { type: { $in: this.FREE_TOKENS_TRANSACTIONS } },
            { createdAt: { $gt: priorDate } },
          ],
        },
      },

      {
        $group: {
          _id: '$recipient',
          balance: {
            $sum: '$amount',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'recipientDetails',
        },
      },
      {
        $unwind: '$recipientDetails',
      },
      {
        $addFields: {
          freeTokens: '$recipientDetails.freeTokens',
          isInChat: '$recipientDetails.isInChat',
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              { $gt: ['$freeTokens', '$balance'] },
              { $ne: ['$isInChat', true] },
            ],
          },
        },
      },
      {
        $project: {
          toClearAmount: {
            $subtract: ['$freeTokens', '$balance'],
          },
        },
      },
    ]);

    if(freeTokensBalanceGroup.length == 0) {
      freeTokensBalanceGroup = await this.tokenTransactionModel.aggregate([
        {
          $match: {
            $and: [
              { type: { $in: this.FREE_TOKENS_TRANSACTIONS } },
              { createdAt: { $lte: priorDate } },
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'recipient',
            foreignField: '_id',
            as: 'recipientDetails',
          },
        },
        {
          $unwind: '$recipientDetails',
        },
        {
          $addFields: {
            freeTokens: '$recipientDetails.freeTokens',
            isInChat: '$recipientDetails.isInChat',
          },
        },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ['$freeTokens', 0] },
                { $ne: ['$isInChat', true] },
              ],
            },
          },
        },
        {
          $project: {
            toClearAmount: '$freeTokens',
            _id: '$recipient'
          },
        },
      ]);
    }

    for(const g of freeTokensBalanceGroup){
      await this.createTransaction(
        new TokenTransactionCreateDto({
          amount: g.toClearAmount,
          sender: g._id,
          type: TokenTransactionType.OUTDATED_FREE,
          fee: TokenTransactionFee.DISABLED,
          status: TokenTransactionStatus.SUCCEDED,
        }),
      );
    }
  }

  public async generateTransactionTokens(options: GenerateTransactionTokens) {
    const fromDate = options.fromDate ? new Date(options.fromDate) : undefined;
    const toDate = options.toDate ? new Date(options.toDate) : undefined;

    const filterData = !fromDate
      ? {
        status: TokenTransactionStatus.SUCCEDED,
      }
      : {
        status: TokenTransactionStatus.SUCCEDED,
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      };

    const tokenTransactionsWithPayments = await this.tokenTransactionModel
      .aggregate([
        {
          $match: filterData,
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'tokenTransaction',
            as: 'payment',
          },
        },
        {
          $unwind: { path: '$payment', preserveNullAndEmptyArrays: true },
        },
        {
          $match: {
            $or: [
              { 'payment.status': { $exists: false } },
              { 'payment.status': { $ne: PaymentStatus.ERROR } },
            ],
          },
        },

        {
          $facet: {
            senderTransaction: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'sender',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $unwind: '$user',
              },
              {
                $project: {
                  _id: 0,
                  userName: '$user.firstName',
                  userEmail: '$user.email',
                  transactionId: { $toString: '$_id' },
                  type: '$type',
                  tokenAmount: { $multiply: [-1, '$amount'] },
                  createdAt: '$createdAt',
                  paymentCurrency: '$payment.currency',
                  paymentAmount: { $divide: ['$payment.amountCents', 100] },
                  paymentId: '$payment.paymentId',
                },
              },
            ],
            recipientTransaction: [
              {
                $lookup: {
                  from: 'users',
                  localField: 'recipient',
                  foreignField: '_id',
                  as: 'user',
                },
              },
              {
                $unwind: '$user',
              },
              {
                $project: {
                  _id: 0,
                  userName: '$user.firstName',
                  userEmail: '$user.email',
                  transactionId: { $toString: '$_id' },
                  type: '$type',
                  tokenAmount: { $subtract: ['$amount', '$feeAmount'] },
                  createdAt: '$createdAt',
                  paymentCurrency: '$payment.currency',
                  paymentAmount: { $divide: ['$payment.amountCents', 100] },
                  paymentId: '$payment.paymentId',
                },
              },
            ],
          },
        },
        {
          $project: {
            combinedTransactions: {
              $concatArrays: ['$senderTransaction', '$recipientTransaction'],
            },
          },
        },
        {
          $unwind: '$combinedTransactions',
        },
        { $replaceRoot: { newRoot: '$combinedTransactions' } },
        { $sort: { createdAt: -1 } },
      ])
      .exec();

    const headers = [
      'User Name',
      'User Email',
      'Transaction Id',
      'Type',
      'Token Amount',
      'Created At',
      'Payment Currency',
      'Payment Amount',
      'Payment Id',
    ];

    return exportWordCsvService(
      tokenTransactionsWithPayments,
      headers,
      'tokens-list',
      options?.isExcel,
    );
  }
}
