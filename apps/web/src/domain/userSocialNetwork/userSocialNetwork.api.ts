import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { UserSocialNetwork } from './userSocialNetwork.model'

export class UserSocialNetworkApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<UserSocialNetwork>,
  ): Promise<UserSocialNetwork[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/userSocialNetworks${buildOptions}`)
  }

  static findOne(
    userSocialNetworkId: string,
    queryOptions?: ApiHelper.QueryOptions<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/userSocialNetworks/${userSocialNetworkId}${buildOptions}`,
    )
  }

  static createOne(
    values: Partial<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    return HttpService.api.post(`/v1/userSocialNetworks`, values)
  }

  static updateOne(
    userSocialNetworkId: string,
    values: Partial<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    return HttpService.api.patch(
      `/v1/userSocialNetworks/${userSocialNetworkId}`,
      values,
    )
  }

  static deleteOne(userSocialNetworkId: string): Promise<void> {
    return HttpService.api.delete(
      `/v1/userSocialNetworks/${userSocialNetworkId}`,
    )
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<UserSocialNetwork>,
  ): Promise<UserSocialNetwork[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/userSocialNetworks${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    return HttpService.api.post(
      `/v1/users/user/${userId}/userSocialNetworks`,
      values,
    )
  }

  static findManyBySocialNetworkId(
    socialNetworkId: string,
    queryOptions?: ApiHelper.QueryOptions<UserSocialNetwork>,
  ): Promise<UserSocialNetwork[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/socialNetworks/socialNetwork/${socialNetworkId}/userSocialNetworks${buildOptions}`,
    )
  }

  static createOneBySocialNetworkId(
    socialNetworkId: string,
    values: Partial<UserSocialNetwork>,
  ): Promise<UserSocialNetwork> {
    return HttpService.api.post(
      `/v1/socialNetworks/socialNetwork/${socialNetworkId}/userSocialNetworks`,
      values,
    )
  }
}
