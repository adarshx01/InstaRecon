import { Module } from '@nestjs/common'
import { AuthenticationDomainModule } from '@server/modules/authentication/domain'
import { SocialNetworkDomainModule } from '../domain'
import { SocialNetworkController } from './socialNetwork.controller'

@Module({
  imports: [AuthenticationDomainModule, SocialNetworkDomainModule],
  controllers: [SocialNetworkController],
  providers: [],
})
export class SocialNetworkApplicationModule {}
