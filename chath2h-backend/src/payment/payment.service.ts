import { Injectable } from '@nestjs/common';
import { Settings } from 'src/settings';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentStatus } from './entities/payment-status';
import { v4 as uuid } from 'uuid';
import { PaymentDto } from './dtos/payment.dto';
import { TokenTransactionService } from 'src/tokenTransaction/token-transaction.service';
import { TokenTransactionCreateDto } from 'src/tokenTransaction/dto/token-transaction-create.dto';
import { TokenTransactionType } from 'src/tokenTransaction/entities/token-transaction-type';
import { TokenTransactionStatus } from 'src/tokenTransaction/entities/token-transaction-status';
import { TokenTransactionFee } from 'src/tokenTransaction/entities/token-transaction-fee';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    private readonly tokenTransactionService: TokenTransactionService,
  ) {
    this.stripe = new Stripe(Settings.STRIPE_SK, {
      apiVersion: '2023-10-16',
    });
  }

  stripe: Stripe;

  getStripeInstance() {
    return this.stripe;
  }

  async createPayment(paymentDto: PaymentDto) {
    const uniqueId: string = uuid();

    let successUrl = `${Settings.FRONTEND_URL}/${
      I18nContext.current().lang
    }/dashboard/my-tokens?status=success`;

    const initInteractionData = paymentDto?.initDataAfterPay;

    if (initInteractionData) {
      const { user, coach, coachOffer } = paymentDto.initDataAfterPay;

      successUrl += `&userId=${user}&coachId=${coach}&coachOfferId=${coachOffer}`;
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'p24', 'blik', 'paypal'],

      line_items: [
        {
          price: Settings.PRICE_100,
          quantity: paymentDto.quantity,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: `${Settings.FRONTEND_URL}/${
        I18nContext.current().lang
      }/dashboard/my-tokens?status=error`,
      payment_intent_data: {
        metadata: {
          uniqueId: uniqueId,
        },
      },
    });

    await this.paymentModel.create({
      user: paymentDto.userId,
      sessionId: session.id,
      status: PaymentStatus.IN_PROGRESS,
      uniqueId: uniqueId,
      tokensQuantity: paymentDto.quantity,
    });

    return session;
  }

  async processPaymentResult(
    id: string,
    status: PaymentStatus,
    paymentId: string,
    amount: number,
    currency: string,
    meta: string | null,
  ) {
    const session = await this.paymentModel.findOne({
      $or: [{ sessionId: id }, { uniqueId: id }],
    });

    session.status = status;
    session.meta = meta;
    session.paymentId = paymentId;
    session.amountCents = amount;
    session.currency = currency;

    const tokenTransaction =
      await this.tokenTransactionService.createTransaction(
        new TokenTransactionCreateDto({
          amount: session.tokensQuantity,
          errorMessage: meta,
          recipient: session.user._id,
          type: TokenTransactionType.BUY,
          status:
            status == PaymentStatus.ERROR
              ? TokenTransactionStatus.ERROR
              : TokenTransactionStatus.TO_TRANSFER_TOKENS,
          fee: TokenTransactionFee.DISABLED,
        }),
      );
    session.tokenTransaction = tokenTransaction;
    await session.save();
  }
}
