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
  SocialNetwork,
  SocialNetworkDomainFacade,
} from '@server/modules/socialNetwork/domain'
import { AuthenticationDomainFacade } from '@server/modules/authentication/domain'
import { RequestHelper } from '../../../helpers/request'
import { SocialNetworkApplicationEvent } from './socialNetwork.application.event'
import {
  SocialNetworkCreateDto,
  SocialNetworkUpdateDto,
} from './socialNetwork.dto'

@Controller('/v1/socialNetworks')
export class SocialNetworkController {
  constructor(
    private eventService: EventService,
    private socialNetworkDomainFacade: SocialNetworkDomainFacade,
    private authenticationDomainFacade: AuthenticationDomainFacade,
  ) {}

  @Get('/')
  async findMany(@Req() request: Request) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const items = await this.socialNetworkDomainFacade.findMany(queryOptions)

    return items
  }

  @Post('/')
  async create(@Body() body: SocialNetworkCreateDto, @Req() request: Request) {
    const { user } = this.authenticationDomainFacade.getRequestPayload(request)

    const item = await this.socialNetworkDomainFacade.create(body)

    await this.eventService.emit<SocialNetworkApplicationEvent.SocialNetworkCreated.Payload>(
      SocialNetworkApplicationEvent.SocialNetworkCreated.key,
      {
        id: item.id,
        userId: user.id,
      },
    )

    return item
  }

  @Get('/:socialNetworkId')
  async findOne(
    @Param('socialNetworkId') socialNetworkId: string,
    @Req() request: Request,
  ) {
    const queryOptions = RequestHelper.getQueryOptions(request)

    const item = await this.socialNetworkDomainFacade.findOneByIdOrFail(
      socialNetworkId,
      queryOptions,
    )

    return item
  }

  @Patch('/:socialNetworkId')
  async update(
    @Param('socialNetworkId') socialNetworkId: string,
    @Body() body: SocialNetworkUpdateDto,
  ) {
    const item =
      await this.socialNetworkDomainFacade.findOneByIdOrFail(socialNetworkId)

    const itemUpdated = await this.socialNetworkDomainFacade.update(
      item,
      body as Partial<SocialNetwork>,
    )
    return itemUpdated
  }

  @Delete('/:socialNetworkId')
  async delete(@Param('socialNetworkId') socialNetworkId: string) {
    const item =
      await this.socialNetworkDomainFacade.findOneByIdOrFail(socialNetworkId)

    await this.socialNetworkDomainFacade.delete(item)

    return item
  }
}
