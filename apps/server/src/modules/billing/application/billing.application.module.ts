import { Module } from '@nestjs/common'
import { HttpModule } from '@server/libraries/http'
import { PaymentModule } from '@server/libraries/payment/payment.module'
import { UploadModule } from '@server/libraries/upload'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { UserDomainModule } from '@server/modules/user/domain'
import { BillingApplicationException } from './billing.application.exception'
import { BillingByMeController, BillingController } from './billing.controller'

@Module({
  imports: [
    HttpModule,
    UploadModule,
    AuthenticationDomainModule,
    PaymentModule,
    UserDomainModule,
  ],
  controllers: [BillingController, BillingByMeController],
  providers: [BillingApplicationException],
})
export class BillingApplicationModule {}
