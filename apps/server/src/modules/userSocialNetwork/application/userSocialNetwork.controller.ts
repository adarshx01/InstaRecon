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
import {
  UserSocialNetwork,
  UserSocialNetworkDomainFacade,
} from '@server/modules/userSocialNetwork/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { UserSocialNetworkApplicationEvent } from './userSocialNetwork.application.event'
import {
  UserSocialNetworkCreateDto,
  UserSocialNetworkUpdateDto,
} from './userSocialNetwork.dto'

@Controller('/v1/userSocialNetworks')
export class UserSocialNetworkController {
  constructor(
    private eventService: EventService,
    private userSocialNetworkDomainFacade: UserSocialNetworkDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items =
      await this.userSocialNetworkDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(
    @Body() body: UserSocialNetworkCreateDto,
    @Req() request: Request,
  ) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.userSocialNetworkDomainFacade.create(body)

    await this.eventService.emit<UserSocialNetworkApplicationEvent.UserSocialNetworkCreated.Payload>(
      UserSocialNetworkApplicationEvent.UserSocialNetworkCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:userSocialNetworkId')
  async findOne(
    @Param('userSocialNetworkId') userSocialNetworkId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.userSocialNetworkDomainFacade.findOneByIdOrFail(
      userSocialNetworkId,
      queryOptions,
    )

    return item
  }

  @Patch('/:userSocialNetworkId')
  async update(
    @Param('userSocialNetworkId') userSocialNetworkId: string,
    @Body() body: UserSocialNetworkUpdateDto,
  ) {
    const item =
      await this.userSocialNetworkDomainFacade.findOneByIdOrFail(
        userSocialNetworkId,
      )

    const itemUpdated = await this.userSocialNetworkDomainFacade.update(
      item,
      body as Partial<UserSocialNetwork>,
    )
    return itemUpdated
  }

  @Delete('/:userSocialNetworkId')
  async delete(@Param('userSocialNetworkId') userSocialNetworkId: string) {
    const item =
      await this.userSocialNetworkDomainFacade.findOneByIdOrFail(
        userSocialNetworkId,
      )

    await this.userSocialNetworkDomainFacade.delete(item)

    return item
  }
}
