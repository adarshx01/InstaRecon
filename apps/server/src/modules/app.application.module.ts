import { Module } from '@nestjs/common'
import { AuthenticationApplicationModule } from './authentication/application'
import { AuthorizationApplicationModule } from './authorization/application'
import { UserApplicationModule } from './user/application'

import { ProfileApplicationModule } from './profile/application'

import { SocialNetworkApplicationModule } from './socialNetwork/application'

import { UserSocialNetworkApplicationModule } from './userSocialNetwork/application'

import { AiApplicationModule } from './ai/application/ai.application.module'
import { BillingApplicationModule } from './billing/application'
import { NotificationApplicationModule } from './notification/application/notification.application.module'
import { UploadApplicationModule } from './upload/application/upload.application.module'

@Module({
  imports: [
    AuthenticationApplicationModule,
    UserApplicationModule,
    AuthorizationApplicationModule,
    NotificationApplicationModule,
    AiApplicationModule,
    UploadApplicationModule,
    BillingApplicationModule,

    ProfileApplicationModule,

    SocialNetworkApplicationModule,

    UserSocialNetworkApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppApplicationModule {}
