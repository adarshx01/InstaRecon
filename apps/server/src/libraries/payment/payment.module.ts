import { Module } from '@nestjs/common'
import { StripeProvider } from './internal/providers/stripe/stripe.provider'
import { PaymentService } from './payment.service'

@Module({
  imports: [],
  providers: [PaymentService, StripeProvider],
  exports: [PaymentService],
})
export class PaymentModule {}
