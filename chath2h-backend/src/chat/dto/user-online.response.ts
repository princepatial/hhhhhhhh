export default class UserOnlineResponse {
  public constructor(init?: Partial<UserOnlineResponse>) {
    Object.assign(this, init);
  }
  isOnline: boolean;
}
