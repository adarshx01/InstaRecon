export namespace UserSocialNetworkApplicationEvent {
  export namespace UserSocialNetworkCreated {
    export const key = 'userSocialNetwork.application.userSocialNetwork.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
