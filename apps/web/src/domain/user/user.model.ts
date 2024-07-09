import { Notification } from '../notification'

import { Profile } from '../profile'

import { UserSocialNetwork } from '../userSocialNetwork'

export enum UserStatus {
  CREATED = 'CREATED',
  VERIFIED = 'VERIFIED',
}
export class User {
  id: string
  email?: string
  status: UserStatus
  name?: string
  pictureUrl?: string
  password?: string
  dateCreated: string
  dateUpdated: string
  notifications?: Notification[]

  profiles?: Profile[]

  userSocialNetworks?: UserSocialNetwork[]
}
