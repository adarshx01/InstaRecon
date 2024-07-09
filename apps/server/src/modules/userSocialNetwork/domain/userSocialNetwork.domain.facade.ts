import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { UserSocialNetwork } from './userSocialNetwork.model'

import { User } from '../../user/domain'

import { SocialNetwork } from '../../socialNetwork/domain'

@Injectable()
export class UserSocialNetworkDomainFacade {
  constructor(
    @InjectRepository(UserSocialNetwork)
    private repository: Repository<UserSocialNetwork>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<UserSocialNetwork>): Promise<UserSocialNetwork> {
    return this.repository.save(values)
  }

  async update(
    item: UserSocialNetwork,
    values: Partial<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: UserSocialNetwork): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<UserSocialNetwork> = {},
  ): Promise<UserSocialNetwork[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<UserSocialNetwork> = {},
  ): Promise<UserSocialNetwork> {
    if (!id) {
      this.databaseHelper.invalidQueryWhere('id')
    }

    const queryOptionsEnsured = {
      includes: queryOptions?.includes,
      filters: {
        id: id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    const item = await query.getOne()

    if (!item) {
      this.databaseHelper.notFoundByQuery(queryOptionsEnsured.filters)
    }

    return item
  }

  async findManyByUser(
    item: User,
    queryOptions: RequestHelper.QueryOptions<UserSocialNetwork> = {},
  ): Promise<UserSocialNetwork[]> {
    if (!item) {
      this.databaseHelper.invalidQueryWhere('user')
    }

    const queryOptionsEnsured = {
      includes: queryOptions.includes,
      orders: queryOptions.orders,
      filters: {
        ...queryOptions.filters,
        userId: item.id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    return query.getMany()
  }

  async findManyBySocialNetwork(
    item: SocialNetwork,
    queryOptions: RequestHelper.QueryOptions<UserSocialNetwork> = {},
  ): Promise<UserSocialNetwork[]> {
    if (!item) {
      this.databaseHelper.invalidQueryWhere('socialNetwork')
    }

    const queryOptionsEnsured = {
      includes: queryOptions.includes,
      orders: queryOptions.orders,
      filters: {
        ...queryOptions.filters,
        socialNetworkId: item.id,
      },
    }

    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptionsEnsured,
    )

    return query.getMany()
  }
}
