export class BillingSubscription {
  productId: string
  dateExpired: string
  status: string
}

export class BillingPayment {
  productId: string
  amount: number
  currency: string
  date: string
}

export class BillingProduct {
  id: string
  type: string
  name: string
  price: number
  description: string
}
