import { Request } from 'express'

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import { EventService } from '@server/libraries/event'
import { Profile, ProfileDomainFacade } from '@server/modules/profile/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { ProfileApplicationEvent } from './profile.application.event'
import { ProfileCreateDto, ProfileUpdateDto } from './profile.dto'

@Controller('/v1/profiles')
export class ProfileController {
  constructor(
    private eventService: EventService,
    private profileDomainFacade: ProfileDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.profileDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: ProfileCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.profileDomainFacade.create(body)

    await this.eventService.emit<ProfileApplicationEvent.ProfileCreated.Payload>(
      ProfileApplicationEvent.ProfileCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:profileId')
  async findOne(
    @Param('profileId') profileId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.profileDomainFacade.findOneByIdOrFail(
      profileId,
      queryOptions,
    )

    return item
  }

  @Patch('/:profileId')
  async update(
    @Param('profileId') profileId: string,
    @Body() body: ProfileUpdateDto,
  ) {
    const item = await this.profileDomainFacade.findOneByIdOrFail(profileId)

    const itemUpdated = await this.profileDomainFacade.update(
      item,
      body as Partial<Profile>,
    )
    return itemUpdated
  }

  @Delete('/:profileId')
  async delete(@Param('profileId') profileId: string) {
    const item = await this.profileDomainFacade.findOneByIdOrFail(profileId)

    await this.profileDomainFacade.delete(item)

    return item
  }
}
