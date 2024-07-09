import { UserSocialNetwork } from '../userSocialNetwork'

export class SocialNetwork {
  id: string

  name: string

  url: string

  dateCreated: string

  dateDeleted: string

  dateUpdated: string

  userSocialNetworks?: UserSocialNetwork[]
}
