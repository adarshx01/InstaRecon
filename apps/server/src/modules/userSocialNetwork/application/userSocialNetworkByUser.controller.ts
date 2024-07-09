import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { UserSocialNetworkDomainFacade } from '@server/modules/userSocialNetwork/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { UserSocialNetworkApplicationEvent } from './userSocialNetwork.application.event'
import { UserSocialNetworkCreateDto } from './userSocialNetwork.dto'

import { UserDomainFacade } from '../../user/domain'

@Controller('/v1/users')
export class UserSocialNetworkByUserController {
  constructor(
    private userDomainFacade: UserDomainFacade,

    private userSocialNetworkDomainFacade: UserSocialNetworkDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/user/:userId/userSocialNetworks')
  async findManyUserId(
    @Param('userId') userId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent = await this.userDomainFacade.findOneByIdOrFail(userId)

    const items = await this.userSocialNetworkDomainFacade.findManyByUser(
      parent,
      queryOptions,
    )

    return items
  }

  @Post('/user/:userId/userSocialNetworks')
  async createByUserId(
    @Param('userId') userId: string,
    @Body() body: UserSocialNetworkCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, userId }

    const item = await this.userSocialNetworkDomainFacade.create(valuesUpdated)

    await this.eventService.emit<UserSocialNetworkApplicationEvent.UserSocialNetworkCreated.Payload>(
      UserSocialNetworkApplicationEvent.UserSocialNetworkCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }
}
