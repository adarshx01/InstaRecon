import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { SocialNetwork } from './socialNetwork.model'

export class SocialNetworkApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<SocialNetwork>,
  ): Promise<SocialNetwork[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/socialNetworks${buildOptions}`)
  }

  static findOne(
    socialNetworkId: string,
    queryOptions?: ApiHelper.QueryOptions<SocialNetwork>,
  ): Promise<SocialNetwork> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/socialNetworks/${socialNetworkId}${buildOptions}`,
    )
  }

  static createOne(values: Partial<SocialNetwork>): Promise<SocialNetwork> {
    return HttpService.api.post(`/v1/socialNetworks`, values)
  }

  static updateOne(
    socialNetworkId: string,
    values: Partial<SocialNetwork>,
  ): Promise<SocialNetwork> {
    return HttpService.api.patch(
      `/v1/socialNetworks/${socialNetworkId}`,
      values,
    )
  }

  static deleteOne(socialNetworkId: string): Promise<void> {
    return HttpService.api.delete(`/v1/socialNetworks/${socialNetworkId}`)
  }
}
