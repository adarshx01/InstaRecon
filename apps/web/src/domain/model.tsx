import { AuthorizationRole as AuthorizationRoleModel } from './authorization/authorization.model'
import {
  BillingPayment as BillingPaymentModel,
  BillingProduct as BillingProductModel,
  BillingSubscription as BillingSubscriptionModel,
} from './billing/billing.model'

import { User as UserModel } from './user/user.model'

import { Notification as NotificationModel } from './notification/notification.model'

import { Profile as ProfileModel } from './profile/profile.model'

import { SocialNetwork as SocialNetworkModel } from './socialNetwork/socialNetwork.model'

import { UserSocialNetwork as UserSocialNetworkModel } from './userSocialNetwork/userSocialNetwork.model'

export namespace Model {
  export class AuthorizationRole extends AuthorizationRoleModel {}
  export class BillingProduct extends BillingProductModel {}
  export class BillingPayment extends BillingPaymentModel {}
  export class BillingSubscription extends BillingSubscriptionModel {}

  export class User extends UserModel {}

  export class Notification extends NotificationModel {}

  export class Profile extends ProfileModel {}

  export class SocialNetwork extends SocialNetworkModel {}

  export class UserSocialNetwork extends UserSocialNetworkModel {}
}
