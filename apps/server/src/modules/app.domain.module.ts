import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from './authentication/domain'
import { AuthorizationDomainModule } from './authorization/domain'

import { UserDomainModule } from './user/domain'

import { NotificationDomainModule } from './notification/domain'

import { ProfileDomainModule } from './profile/domain'

import { SocialNetworkDomainModule } from './socialNetwork/domain'

import { UserSocialNetworkDomainModule } from './userSocialNetwork/domain'

@Module({
  imports: [
    AuthenticationDomainModule,
    AuthorizationDomainModule,
    UserDomainModule,
    NotificationDomainModule,

    ProfileDomainModule,

    SocialNetworkDomainModule,

    UserSocialNetworkDomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppDomainModule {}
