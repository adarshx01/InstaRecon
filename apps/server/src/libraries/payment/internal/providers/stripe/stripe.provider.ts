import { Injectable } from '@nestjs/common'
import { ConfigurationService } from '@server/core/configuration'
import { Logger, LoggerService } from '@server/libraries/logger'
import { Stripe as StripeSDK } from 'stripe'
import {
  Payment,
  Product,
  ProductType,
  StripeWebhookResponse,
  Subscription,
} from '../../payment.type'
import { Provider, ProviderCreatePaymentLinkOptions } from '../provider'

@Injectable()
export class StripeProvider implements Provider {
  private logger: Logger
  private client: StripeSDK
  private webhookSecret: string

  constructor(
    private configurationService: ConfigurationService,
    private loggerService: LoggerService,
  ) {
    this.logger = this.loggerService.create({ name: 'StripeProvider' })

    this.initialise()
  }

  isActive(): boolean {
    if (this.client) {
      return true
    } else {
      return false
    }
  }

  private initialise(): void {
    this.logger.log('Initialization...')

    try {
      const secretKey = this.configurationService.get(
        'SERVER_PAYMENT_STRIPE_SECRET_KEY',
      )

      this.webhookSecret = this.configurationService.get(
        'SERVER_PAYMENT_STRIPE_WEBHOOK_SECRET',
      )

      if (!this.webhookSecret && !secretKey) {
        throw new Error(
          'Set SERVER_PAYMENT_STRIPE_SECRET_KEY && SERVER_PAYMENT_STRIPE_WEBHOOK_SECRET in your .env to activate',
        )
      }

      if (!this.webhookSecret) {
        throw new Error(
          'Set SERVER_PAYMENT_STRIPE_WEBHOOK_SECRET in your .env to activate',
        )
      }

      if (!secretKey) {
        throw new Error(
          'Set SERVER_PAYMENT_STRIPE_SECRET_KEY in your .env to activate',
        )
      }

      this.client = new StripeSDK(secretKey, {
        apiVersion: '2024-04-10',
      })

      this.logger.success(`Stripe active`)
    } catch (error) {
      this.logger.warning(`Stripe failed to start`)
      this.logger.warning(error)
    }
  }

  async findManySubscriptions(customerId: string): Promise<Subscription[]> {
    const response = await this.client.subscriptions.list({
      customer: customerId,
    })

    const subscriptions = []

    for (const subscription of response.data) {
      subscriptions.push({
        productId: subscription.items?.data?.[0].price?.product,
        dateExpired: new Date(subscription.current_period_end * 1000),
        status: subscription.status,
      })
    }
    return subscriptions
  }

  async findManyPayments(customerId: string): Promise<Payment[]> {
    const response = await this.client.checkout.sessions.list({
      expand: ['data.line_items'],
      customer: customerId,
    })
    const checkoutSessions = response.data?.filter(
      session => session.payment_status === 'paid',
    )

    const payments = []

    for (const session of checkoutSessions) {
      for (const lineItem of session.line_items.data) {
        payments.push({
          productId: lineItem.price.product,
          amount: lineItem.price.unit_amount / 100,
          currency: lineItem.price.currency,
          date: new Date(session.created * 1000),
        })
      }
    }

    return payments
  }

  async findManyProducts(): Promise<Product[]> {
    const response = await this.client.products.list({
      expand: ['data.default_price'],
    })

    const products = []

    for (const item of response.data) {
      const product: Product = {
        id: item.id,
        type: ProductType.ONE_TIME,
        name: item.name,
        price: 0,
        description: item.description,
      }

      const price = item.default_price as StripeSDK.Price

      if (price?.recurring) {
        product.type = ProductType.SUBSCRIPTION
      }

      product.price = price?.unit_amount / 100 ?? 0

      products.push(product)
    }

    return products
  }

  async onPayment(body: Buffer, sig: string): Promise<StripeWebhookResponse> {
    try {
      const event = this.client.webhooks.constructEvent(
        body.toString(),
        sig,
        this.webhookSecret,
      ) as StripeSDK.CheckoutSessionCompletedEvent

      const data = event.data?.object

      if (event.type === 'checkout.session.completed') {
        this.logger.success(`Stripe event "${event.type}" received`)

        return {
          userId: data.client_reference_id,
          stripeCustomerId: data.customer as string,
          metadata: data.metadata ?? {},
          customerDetails: data.customer_details,
        }
      }

      this.logger.log(`Stripe event "${event.type}" is not handled.`)

      return null
    } catch (error) {
      throw new Error(`Could not check webhook: ${error.message}`)
    }
  }

  async createPaymentLink({
    customerId,
    productId,
    urlRedirection,
    metadata = {},
  }: ProviderCreatePaymentLinkOptions): Promise<string> {
    const price = await this.findOnePriceByIdOrFail(productId)

    const session = await this.client.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: price.recurring ? 'subscription' : 'payment',
      customer: customerId,
      ui_mode: 'hosted',
      success_url: urlRedirection,
      metadata: metadata,
    })

    return session.url
  }

  async createCustomer(customer: {
    name: string
    email: string
  }): Promise<string> {
    const result = await this.client.customers.create({
      name: customer.name,
      email: customer.email,
    })

    return result.id
  }

  private async findOnePriceByIdOrFail(
    productId: string,
  ): Promise<StripeSDK.Price> {
    const prices = await this.client.prices.list({
      product: productId,
      limit: 1,
    })

    const price = prices.data?.[0]

    if (!price) {
      throw new Error(`Could not find price for product ${productId}`)
    }

    return price
  }
}
