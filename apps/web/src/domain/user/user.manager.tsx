import { Utility } from '@web/libraries/utility'
import { User, UserStatus } from './user.model'

export namespace UserManager {
  export function isVerified(user: User): boolean {
    return user?.status === UserStatus.VERIFIED
  }

  export function isVisitor(user: User): boolean {
    return Utility.isNull(user?.email) && Utility.isDefined(user?.id)
  }
}
