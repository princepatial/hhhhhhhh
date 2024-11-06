import { MongoClient } from 'mongodb';
import { Settings } from '../settings';

const MONGO_URL = `mongodb://${Settings.DB_HOST}:${Settings.DB_PORT}/${Settings.DB_NAME}`;

export const getDb = async () => {
  const client = await MongoClient.connect(MONGO_URL);
  return client.db();
};
