import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@server/modules/user/domain'
import { Repository } from 'typeorm'
import { AuthorizationRole } from './authorization.role.model'
import { AuthorizationRoleUser } from './authorization.roleUser.model'

@Injectable()
export class AuthorizationRoleUserFacade {
  constructor(
    @InjectRepository(AuthorizationRoleUser)
    private repository: Repository<AuthorizationRoleUser>,
  ) {}

  async create(
    user: User,
    role: AuthorizationRole,
  ): Promise<AuthorizationRoleUser> {
    const values = {
      userId: user.id,
      roleId: role.id,
    }

    return this.repository.save(values)
  }
}
