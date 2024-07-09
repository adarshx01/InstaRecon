import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DatabaseHelper } from '../../../core/database'
import { RequestHelper } from '../../../helpers/request'
import { SocialNetwork } from './socialNetwork.model'

@Injectable()
export class SocialNetworkDomainFacade {
  constructor(
    @InjectRepository(SocialNetwork)
    private repository: Repository<SocialNetwork>,
    private databaseHelper: DatabaseHelper,
  ) {}

  async create(values: Partial<SocialNetwork>): Promise<SocialNetwork> {
    return this.repository.save(values)
  }

  async update(
    item: SocialNetwork,
    values: Partial<SocialNetwork>,
  ): Promise<SocialNetwork> {
    const itemUpdated = { ...item, ...values }

    return this.repository.save(itemUpdated)
  }

  async delete(item: SocialNetwork): Promise<void> {
    await this.repository.softDelete(item.id)
  }

  async findMany(
    queryOptions: RequestHelper.QueryOptions<SocialNetwork> = {},
  ): Promise<SocialNetwork[]> {
    const query = this.databaseHelper.applyQueryOptions(
      this.repository,
      queryOptions,
    )

    return query.getMany()
  }

  async findOneByIdOrFail(
    id: string,
    queryOptions: RequestHelper.QueryOptions<SocialNetwork> = {},
  ): Promise<SocialNetwork> {
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
}
