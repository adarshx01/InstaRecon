import { HttpService } from '../../core/http'
import {
  BillingPayment,
  BillingProduct,
  BillingSubscription,
} from './billing.model'

/**
 * @provider BillingApi
 * @description A library to query the billing API
 * @function {() => Promise<BillingProduct[]>} findManyProducts - Find many products
 * @function {() => Promise<BillingSubscription[]>} findManySubscriptions - Find many subscriptions
 * @function {() => Promise<BillingPayment[]>} findManyPayments - Find many payments
 * @function {(productId: string) => Promise<string>} createPaymentLink - Create a payment link for a product
 * @usage `Api.Billing.findManyProducts(); Api.Billing.findManySubscriptions()`
 * @isImportOverriden false
 * @import import { Api } from '@web/domain'
 */
export class BillingApi {
  static findManyProducts(): Promise<BillingProduct[]> {
    return HttpService.api.get(`/v1/billing/products`)
  }

  static findManySubscriptions(): Promise<BillingSubscription[]> {
    return HttpService.api.get(`/v1/users/me/billing/subscriptions`)
  }

  static findManyPayments(): Promise<BillingPayment[]> {
    return HttpService.api.get(`/v1/users/me/billing/payments`)
  }

  static createPaymentLink(productId: string): Promise<string> {
    return HttpService.api
      .post<any>(`/v1/users/me/billing/products/${productId}/payment-link`, {})
      .then(({ url }) => url)
  }
}
