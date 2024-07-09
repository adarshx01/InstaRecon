export namespace SocialNetworkApplicationEvent {
  export namespace SocialNetworkCreated {
    export const key = 'socialNetwork.application.socialNetwork.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
