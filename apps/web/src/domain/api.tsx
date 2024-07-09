import { AiApi } from './ai/ai.api'
import { AuthenticationApi } from './authentication/authentication.api'
import { AuthorizationApi } from './authorization/authorization.api'
import { BillingApi } from './billing/billing.api'
import { UploadApi } from './upload/upload.api'

import { UserApi } from './user/user.api'

import { NotificationApi } from './notification/notification.api'

import { ProfileApi } from './profile/profile.api'

import { SocialNetworkApi } from './socialNetwork/socialNetwork.api'

import { UserSocialNetworkApi } from './userSocialNetwork/userSocialNetwork.api'

export namespace Api {
  export class Ai extends AiApi {}
  export class Authentication extends AuthenticationApi {}
  export class Authorization extends AuthorizationApi {}
  export class Billing extends BillingApi {}
  export class Upload extends UploadApi {}

  export class User extends UserApi {}

  export class Notification extends NotificationApi {}

  export class Profile extends ProfileApi {}

  export class SocialNetwork extends SocialNetworkApi {}

  export class UserSocialNetwork extends UserSocialNetworkApi {}
}
