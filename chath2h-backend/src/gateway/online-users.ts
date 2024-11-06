import { OnlineUser } from './online-user';

export default class OnlineUsersCollection {
  private onlineUsers = new Map<string, OnlineUser>();

  private createKey(userId: string, clientId: string) {
    return userId + clientId;
  }

  public set(user: OnlineUser) {
    const key = this.createKey(user.userId, user.client.id);
    this.onlineUsers.set(key, user);
  }

  public get(keyOrUserId: string): OnlineUser | OnlineUser[] {
    return this.getByKey(keyOrUserId) || this.getByUserId(keyOrUserId);
  }

  public getByKey(key: string): OnlineUser {
    return this.onlineUsers.get(key);
  }

  public getByUserId(userId: string): OnlineUser[] {
    const result: OnlineUser[] = [];
    for (const user of this.onlineUsers.values()) {
      if (user.userId == userId) {
        result.push(user);
      }
    }
    return result;
  }

  public getOnlineUsers() {
    const uniqueUsers = [...this.onlineUsers.entries()].reduce(
      (acc, [key, onlineUser]) => {
        const userExists = acc.some(
          (user) => user.userId === onlineUser.userId,
        );

        if (!userExists) {
          acc.push(onlineUser);
        }

        return acc;
      },
      [],
    );

    const users = uniqueUsers.map((onlineUser) => ({
      userId: onlineUser.userId,
      status: onlineUser.status,
    }));

    return users;
  }

  public delete(userId: string, clientId: string) {
    const key = this.createKey(userId, clientId);
    this.onlineUsers.delete(key);
  }
}
