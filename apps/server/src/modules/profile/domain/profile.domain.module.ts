import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseHelperModule } from '../../../core/database'
import { ProfileDomainFacade } from './profile.domain.facade'
import { Profile } from './profile.model'

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), DatabaseHelperModule],
  providers: [ProfileDomainFacade, ProfileDomainFacade],
  exports: [ProfileDomainFacade],
})
export class ProfileDomainModule {}
