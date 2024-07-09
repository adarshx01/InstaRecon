import { HttpStatus, Injectable } from '@nestjs/common'
import { ExceptionService } from '@server/core/exception'

@Injectable()
export class BillingApplicationException {
  constructor(private service: ExceptionService) {}

  paymentNotActivated(): never {
    return this.service.throw({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      code: 0,
      publicMessage: 'Payment is not available.',
      privateMessage: 'There is no active payment provider.',
    })
  }

  noCustomerId(userId: string): never {
    return this.service.throw({
      status: HttpStatus.NOT_FOUND,
      code: 10,
      publicMessage: 'Could not find customer.',
      privateMessage: `Could not find Stripe customer associated with user id ${userId}`,
    })
  }
}
