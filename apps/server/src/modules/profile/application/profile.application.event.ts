export namespace ProfileApplicationEvent {
  export namespace ProfileCreated {
    export const key = 'profile.application.profile.created'

    export type Payload = {
      id: string
      userId: string
    }
  }
}
