import { getDb } from '../migrations-utils/db';

export const up = async () => {
  try {
    const db = await getDb();
    const documentsToInsert = [
      {
        name: 'at home',
        image: '/images/at_home.jpeg',
      },
      {
        name: 'assets',
        image: '/images/assets.webp',
      },
      {
        name: 'bad luck',
        image: '/images/bad_luck.jpeg',
      },
      {
        name: 'emigration',
        image: '/images/emigration.jpeg',
      },
      {
        name: 'daughter',
        image: '/images/daughter.jpeg',
      },
      {
        name: 'son',
        image: '/images/son.webp',
      },
      {
        name: 'mother',
        image: '/images/mother.jpeg',
      },
      {
        name: 'father',
        image: '/images/father.jpeg',
      },
      {
        name: 'faith',
        image: '/images/faith.webp',
      },
      {
        name: 'freeTime',
        image: '/images/free_time.jpeg',
      },
      {
        name: 'friends',
        image: '/images/friends.jpeg',
      },
      {
        name: 'job',
        image: '/images/job.jpeg',
      },
      {
        name: 'hobby',
        image: '/images/hobby.jpeg',
      },
      {
        name: 'guilt and atonement',
        image: '/images/guilt.jpeg',
      },
      {
        name: 'happiness',
        image: '/images/happiness.jpeg',
      },
      {
        name: 'health',
        image: '/images/health.jpeg',
      },
      {
        name: 'neighbors',
        image: '/images/neighbors.jpeg',
      },
      {
        name: 'pets',
        image: '/images/pets.webp',
      },
      {
        name: 'planet',
        image: '/images/planet.jpeg',
      },
      {
        name: 'profession',
        image: '/images/profession.jpeg',
      },
      {
        name: 'relationships',
        image: '/images/relationships.jpeg',
      },
      {
        name: 'school',
        image: '/images/school.webp',
      },
      {
        name: 'social media',
        image: '/images/social_media.webp',
      },
      {
        name: 'violence',
        image: '/images/violence.jpeg',
      },
      {
        name: 'start-up',
        image: '/images/start_up.jpeg',
      },
      {
        name: 'study',
        image: '/images/study.jpeg',
      },
      {
        name: 'trauma',
        image: '/images/trauma.jpeg',
      },
      {
        name: 'vacation',
        image: '/images/vacation.webp',
      },
      {
        name: 'work colleagues',
        image: '/images/work_colleagues.webp',
      },
    ];

    await db.collection('areas').insertMany(documentsToInsert);
  } catch (error) {
    console.error('Error inserting documents:', error);
    throw error;
  }
};

export const down = async () => {
  const db = await getDb();
};
