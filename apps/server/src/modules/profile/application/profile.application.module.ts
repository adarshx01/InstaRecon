import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { ProfileDomainModule } from '../domain'
import { ProfileController } from './profile.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { ProfileByUserController } from './profileByUser.controller'

@Module({
  imports: [AuthenticationDomainModule, ProfileDomainModule, UserDomainModule],
  controllers: [ProfileController, ProfileByUserController],
  providers: [],
})
export class ProfileApplicationModule {}
