import { HttpService } from '../../core/http'
import { ApiHelper } from '../helpers/api.helper'
import { Profile } from './profile.model'

export class ProfileApi {
  static findMany(
    queryOptions?: ApiHelper.QueryOptions<Profile>,
  ): Promise<Profile[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/profiles${buildOptions}`)
  }

  static findOne(
    profileId: string,
    queryOptions?: ApiHelper.QueryOptions<Profile>,
  ): Promise<Profile> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(`/v1/profiles/${profileId}${buildOptions}`)
  }

  static createOne(values: Partial<Profile>): Promise<Profile> {
    return HttpService.api.post(`/v1/profiles`, values)
  }

  static updateOne(
    profileId: string,
    values: Partial<Profile>,
  ): Promise<Profile> {
    return HttpService.api.patch(`/v1/profiles/${profileId}`, values)
  }

  static deleteOne(profileId: string): Promise<void> {
    return HttpService.api.delete(`/v1/profiles/${profileId}`)
  }

  static findManyByUserId(
    userId: string,
    queryOptions?: ApiHelper.QueryOptions<Profile>,
  ): Promise<Profile[]> {
    const buildOptions = ApiHelper.buildQueryOptions(queryOptions)

    return HttpService.api.get(
      `/v1/users/user/${userId}/profiles${buildOptions}`,
    )
  }

  static createOneByUserId(
    userId: string,
    values: Partial<Profile>,
  ): Promise<Profile> {
    return HttpService.api.post(`/v1/users/user/${userId}/profiles`, values)
  }
}
