import { ObjectId } from 'mongodb';
import { getDb } from '../migrations-utils/db';

export const up = async () => {
  try {
    const db = await getDb();

    const admin = {
      email: 'admin@coachh2h.com',
      firstName: 'H2H Coach Admin',
      gender: 'OTHER',
      age: 1,
      language: 'DE',
      country: 'DE',
      city: 'DE',
      education: 'admin',
      avatar: new ObjectId('64f6deba74c584c45b01a340'),
      admin: true,
      tokens: 0,
    };

    await db.collection('users').insertOne(admin);
  } catch (error) {
    console.error('Error inserting documents:', error);
    throw error;
  }
};

export const down = async () => {
  console.log('Empty down migration - admin');
};
