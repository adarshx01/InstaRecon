import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { UserSocialNetworkDomainModule } from '../domain'
import { UserSocialNetworkController } from './userSocialNetwork.controller'

import { UserDomainModule } from '../../../modules/user/domain'

import { UserSocialNetworkByUserController } from './userSocialNetworkByUser.controller'

import { SocialNetworkDomainModule } from '../../../modules/socialNetwork/domain'

import { UserSocialNetworkBySocialNetworkController } from './userSocialNetworkBySocialNetwork.controller'

@Module({
  imports: [
    AuthenticationDomainModule,
    UserSocialNetworkDomainModule,

    UserDomainModule,

    SocialNetworkDomainModule,
  ],
  controllers: [
    UserSocialNetworkController,

    UserSocialNetworkByUserController,

    UserSocialNetworkBySocialNetworkController,
  ],
  providers: [],
})
export class UserSocialNetworkApplicationModule {}
