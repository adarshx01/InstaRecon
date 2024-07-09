import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { SocialNetworkDomainFacade } from './socialNetwork.domain.facade'
import { SocialNetwork } from './socialNetwork.model'

@Module({
  imports: [TypeOrmModule.forFeature([SocialNetwork]), DatabaseHelperModule],
  providers: [SocialNetworkDomainFacade, SocialNetworkDomainFacade],
  exports: [SocialNetworkDomainFacade],
})
export class SocialNetworkDomainModule {}
