import { User } from '../user'

export class Profile {
  id: string

  publicUrl?: string

  bio?: string

  avatarUrl?: string

  userId: string

  user?: User

  dateCreated: string

  dateDeleted: string

  dateUpdated: string
}
