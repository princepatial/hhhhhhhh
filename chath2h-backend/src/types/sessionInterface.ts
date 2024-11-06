import { User } from 'src/users/entities/user.entity';

declare module 'express' {
  interface Request {
    user: User;
  }
}

declare module 'express-session' {
  interface SessionData {
    user: { email: string };
  }
}
