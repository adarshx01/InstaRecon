import { Request } from 'express'

import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common'
import { RequestHelper } from '@server/helpers/request'
import { EventService } from '@server/libraries/event'
import { UserSocialNetworkDomainFacade } from '@server/modules/userSocialNetwork/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { UserSocialNetworkApplicationEvent } from './userSocialNetwork.application.event'
import { UserSocialNetworkCreateDto } from './userSocialNetwork.dto'

import { SocialNetworkDomainFacade } from '../../socialNetwork/domain'

@Controller('/v1/socialNetworks')
export class UserSocialNetworkBySocialNetworkController {
  constructor(
    private socialNetworkDomainFacade: SocialNetworkDomainFacade,

    private userSocialNetworkDomainFacade: UserSocialNetworkDomainFacade,
    private eventService: EventService,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/socialNetwork/:socialNetworkId/userSocialNetworks')
  async findManySocialNetworkId(
    @Param('socialNetworkId') socialNetworkId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const parent =
      await this.socialNetworkDomainFacade.findOneByIdOrFail(socialNetworkId)

    const items =
      await this.userSocialNetworkDomainFacade.findManyBySocialNetwork(
        parent,
        queryOptions,
      )

    return items
  }

  @Post('/socialNetwork/:socialNetworkId/userSocialNetworks')
  async createBySocialNetworkId(
    @Param('socialNetworkId') socialNetworkId: string,
    @Body() body: UserSocialNetworkCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const valuesUpdated = { ...body, socialNetworkId }

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
