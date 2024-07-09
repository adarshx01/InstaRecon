import { Controller, Get, Param, Post, Req } from '@nestjs/common'
import { Authentication } from '@server/core/authentication'
import { ConfigurationService } from '@server/core/configuration'
import { RequestHelper } from '@server/helpers/request'
import { Utility } from '@server/helpers/utility'
import { Logger, LoggerService } from '@server/libraries/logger'
import { PaymentService } from '@server/libraries/payment'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { User, UserDomainFacade } from '@server/modules/user/domain'
import { Request } from 'express'
import { BillingApplicationException } from './billing.application.exception'

@Controller('/v1/billing')
export class BillingController {
  private logger: Logger

  constructor(
    private exception: BillingApplicationException,
    private userDomainFacade: UserDomainFacade,
    private paymentService: PaymentService,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.create({ name: 'BillingController' })
  }

  @Get('/products')
  @Authentication.Public()
  async products() {
    if (!this.paymentService.isActive()) {
      this.exception.paymentNotActivated()
    }

    return this.paymentService.findManyProducts()
  }

  @Authentication.Public()
  @Post('/stripe/webhook/raw')
  async handleStripeWebhook(@Req() request: Request) {
    if (!this.paymentService.isActive()) {
      this.exception.paymentNotActivated()
    }

    this.logger.log(`Stripe webhook received`)

    const body = RequestHelper.getRawBody(request)
    const sig = request.headers['stripe-signature'] as string

    try {
      const data = await this.paymentService.onPayment(body, sig)

      if (!data) {
        return
      }

      const { userId, stripeCustomerId, metadata } = data

      if (Utility.isDefined(userId)) {
        const user = await this.userDomainFacade.findOneByIdOrFail(userId)

        if (Utility.isDefined(stripeCustomerId)) {
          await this.userDomainFacade.update(user, { stripeCustomerId })

          this.logger.log(
            `Stripe customer id "${stripeCustomerId}" saved on user "${user.id}"`,
          )
        }

        return
      }

      if (Utility.isDefined(stripeCustomerId)) {
        const user =
          await this.userDomainFacade.findOneByStripeCustomerIdOrFail(
            stripeCustomerId,
          )

        this.logger.log(
          `Found user "${user.id}" with stripe customer id "${stripeCustomerId}"`,
        )

        return
      }
    } catch (error) {
      this.logger.error(`Could not handle Stripe webhook`)
      this.logger.error(error)
    }
  }
}

@Controller('/v1/users/me/billing')
export class BillingByMeController {
  constructor(
    private exception: BillingApplicationException,
    private authenticationDomainFacade: AuthenticationDomainFacade,
    private configurationService: ConfigurationService,
    private userDomainFacade: UserDomainFacade,
    private paymentService: PaymentService,
  ) {}

  @Get('/payments')
  async findManyPayments(@Req() request: Request) {
    if (!this.paymentService.isActive()) {
      this.exception.paymentNotActivated()
    }

    const payload = this.authenticationDomainFacade.getRequestPayload(request)

    const user = await this.findOneUserOrFail(payload.user.id)

    if (!this.paymentService.getCustomerId(user)) {
      this.exception.noCustomerId(user.id)
    }

    const payments = await this.paymentService.findManyPayments(user)

    return payments
  }

  @Get('/subscriptions')
  async findManySubscriptions(@Req() request: Request) {
    if (!this.paymentService.isActive()) {
      this.exception.paymentNotActivated()
    }

    const payload = this.authenticationDomainFacade.getRequestPayload(request)

    const user = await this.findOneUserOrFail(payload.user.id)

    if (!this.paymentService.getCustomerId(user)) {
      this.exception.noCustomerId(user.id)
    }

    const subscriptions = await this.paymentService.findManySubscriptions(user)

    return subscriptions
  }

  @Post('/products/:productId/payment-link')
  async getPaymentLink(
    @Req() request: Request,
    @Param('productId') productId: string,
  ) {
    if (!this.paymentService.isActive()) {
      this.exception.paymentNotActivated()
    }

    const payload = this.authenticationDomainFacade.getRequestPayload(request)

    let user = await this.findOneUserOrFail(payload.user.id)

    let stripeCustomerId = this.paymentService.getCustomerId(user)

    if (Utility.isNull(stripeCustomerId)) {
      stripeCustomerId = await this.paymentService.createCustomer(user)

      user = await this.userDomainFacade.update(user, {
        stripeCustomerId,
      })
    }

    const urlRedirection = this.configurationService.getClientBaseUrl()

    const url = await this.paymentService.createPaymentLink({
      user,
      productId,
      metadata: {},
      urlRedirection,
    })

    return { url }
  }

  private async findOneUserOrFail(userId: string): Promise<User> {
    const user =
      await this.userDomainFacade.findOneByIdWithStripeCustomerIdOrFail(userId)

    return user
  }
}
