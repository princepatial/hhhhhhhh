import * as session from 'express-session';
import * as MongoDBStore from 'connect-mongodb-session';
import { Settings } from './settings';

const mongoDBStore = MongoDBStore(session);
const store = new mongoDBStore({
  uri: `mongodb://${Settings.DB_HOST}:${Settings.DB_PORT}/${Settings.DB_NAME}`,
  collection: 'sessions',
});

export const sharedSessionMiddleware = session({
  name: 'H2H_auth_cookie',
  secret: Settings.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 28800000,
  },
  store,
});
