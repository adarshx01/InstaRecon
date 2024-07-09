import { User } from '../user'

import { SocialNetwork } from '../socialNetwork'

export class UserSocialNetwork {
  id: string

  profileUrl?: string

  userId: string

  user?: User

  socialNetworkId: string

  socialNetwork?: SocialNetwork

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
