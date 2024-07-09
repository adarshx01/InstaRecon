import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { ProfileDomainFacade } from '@server/modules/profile/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { ProfileApplicationEvent } from './profile.application.event'
import { ProfileCreateDto } from './profile.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class ProfileByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private profileDomainFacade: ProfileDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/user/:userId/profiles')
  async findManyUserId(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.userDomainFacade.findOneByIdOrFail(userId)

    const items = await this.profileDomainFacade.findManyByUser(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/user/:userId/profiles')
  async createByUserId(
    @Param('userId') userId: string,
    @Body() body: ProfileCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, userId }

    const item = await this.profileDomainFacade.create(valuesUpdated)

    await this.eventService.emit<ProfileApplicationEvent.ProfileCreated.Payload>(
      ProfileApplicationEvent.ProfileCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
