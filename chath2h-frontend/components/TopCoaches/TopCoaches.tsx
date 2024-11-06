import coachesBackground from '@images/landingPage/coachesBackground.png';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useTopCoaches } from 'queries/coachQuery';
import SingleCoach from './SingleCoach';
import styles from './TopCoaches.module.scss';

const TopCoaches = () => {
  const { data: topCoaches } = useTopCoaches();
  const { t } = useTranslation('common');

  if (!topCoaches?.length) return null;
  return (
    <div className={styles.container}>
      <Image
        className={styles.coachesBackground}
        src={coachesBackground}
        alt="coaches background"
        style={{ objectFit: 'cover' }}
        fill
      />
      <div className={styles.coaches}>
        <div className={styles.title}>{t('top_coaches_title')}</div>
        <div className={styles.list}>
          {topCoaches.map((coach: SingleCoach, index: number) => (
            <div className={styles.list_item} key={`${coach.firstName}_${index}`}>
              <SingleCoach data={coach} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCoaches;
