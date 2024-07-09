import { HttpStatus, Injectable } from '@nestjs/common'
import { ExceptionService } from '@server/core/exception'
import { User } from '@server/modules/user/domain'

@Injectable()
export class AuthenticationInfrastructureException {
  constructor(private service: ExceptionService) {}

  invalidAccessToken() {
    return this.service.throw({
      status: HttpStatus.UNAUTHORIZED,
      code: 0,
      publicMessage: 'Access token is invalid',
    })
  }

  userNotVerifiedUnauthorized(user: User) {
    return this.service.throw({
      status: HttpStatus.UNAUTHORIZED,
      code: 1,
      publicMessage: 'You must verify your account',
      privateMessage: `User ${user.email} is not verified (${user.status})`,
    })
  }

  userVisitorUnauthorized(user: User) {
    return this.service.throw({
      status: HttpStatus.UNAUTHORIZED,
      code: 2,
      publicMessage: 'You must create an account',
      privateMessage: `User visitor "${user.id}" is not authorized`,
    })
  }
}
