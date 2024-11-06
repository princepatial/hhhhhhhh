import {
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { Authless } from 'src/decorators/authless.decorator';
import { ApiTags } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Settings } from 'src/settings';
import { PaymentService } from './payment.service';
import { PaymentStatus } from './entities/payment-status';
import { PaymentDto } from './dtos/payment.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/session')
  async createSession(
    @Req() req: Request,
    @Body(new ValidationPipe()) paymentDto: PaymentDto,
  ) {
    paymentDto.userId = req.user._id.toString();
    const session = await this.paymentService.createPayment(paymentDto);
    return { redirectUrl: session.url };
  }

  @Authless()
  @Post('/webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    let event: Stripe.Event;
    const stripe = this.paymentService.getStripeInstance();
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers['stripe-signature'],
        Settings.WEBHOOK_PK,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return { success: false };
    }

    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;

    //success payment
    if (eventType === 'checkout.session.completed') {
      const session = data.object as Stripe.Checkout.Session;
      this.paymentService.processPaymentResult(
        session.id,
        PaymentStatus.SUCCEDED,
        session.payment_intent.toString(),
        session.amount_total,
        session.currency,
        null,
      );
    }

    //error payment
    if (eventType === 'payment_intent.payment_failed') {
      const paymentIntent = data.object as Stripe.PaymentIntent;
      this.paymentService.processPaymentResult(
        paymentIntent.metadata.uniqueId,
        PaymentStatus.ERROR,
        paymentIntent.id,
        paymentIntent.amount,
        paymentIntent.currency,
        paymentIntent.last_payment_error?.message,
      );
    }
    return { success: true };
  }
}
