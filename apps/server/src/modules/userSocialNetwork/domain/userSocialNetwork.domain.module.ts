import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { UserSocialNetworkDomainFacade } from './userSocialNetwork.domain.facade'
import { UserSocialNetwork } from './userSocialNetwork.model'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSocialNetwork]),
    DatabaseHelperModule,
  ],
  providers: [UserSocialNetworkDomainFacade, UserSocialNetworkDomainFacade],
  exports: [UserSocialNetworkDomainFacade],
})
export class UserSocialNetworkDomainModule {}
