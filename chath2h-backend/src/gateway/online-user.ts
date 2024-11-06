import { Socket } from 'socket.io';

export class OnlineUser {
  constructor(client: Socket, status: string, userId: string) {
    this._client = new WeakRef(client);
    this.status = status;
    this.userId = userId;
  }
  private _client: WeakRef<Socket>;
  status: string;
  userId: string;

  get client(): Socket {
    return this._client.deref();
  }
}
