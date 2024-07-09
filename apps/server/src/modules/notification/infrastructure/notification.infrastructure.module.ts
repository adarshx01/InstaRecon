import { Module } from '@nestjs/common'
import { SocketModule } from '@server/libraries/socket'
import { AuthorizationDomainModule } from '@server/modules/authorization/domain'
import { NotificationDomainModule } from '../domain'

import { NotificationProfileSubscriber } from './subscribers/notification.profile.subscriber'

import { NotificationSocialNetworkSubscriber } from './subscribers/notification.socialNetwork.subscriber'

import { NotificationUserSocialNetworkSubscriber } from './subscribers/notification.userSocialNetwork.subscriber'

@Module({
  imports: [AuthorizationDomainModule, NotificationDomainModule, SocketModule],
  providers: [
    NotificationProfileSubscriber,

    NotificationSocialNetworkSubscriber,

    NotificationUserSocialNetworkSubscriber,
  ],
  exports: [],
})
export class NotificationInfrastructureModule {}
