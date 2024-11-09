import CoachBigTile from 'components/Coach/CoachBigTile';
import styles from './FavoriteCoaches.module.scss';
import { CoachesWithCategories } from 'globalTypes';
import { useTranslation } from 'next-i18next';
import useImageUrl from 'hooks/getImageUrl';

const FavoriteCoaches = ({
  coaches = [],
  categoriesClass
}: {
  coaches: CoachesWithCategories[];
  categoriesClass?: string;
}) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <span className={styles.title}>{t('favorite_coaches_title')}</span>
      {coaches.length ? (
        coaches.map((coach) => (
          <div className={styles.coach} key={coach.user._id}>
            <CoachBigTile
              isFollowCoach={true}
              id={coach.user._id}
              categoriesClass={categoriesClass}
              imageSrc={useImageUrl(
                coach.user.coachProfile.coachPhoto
                  ? coach.user.coachProfile.coachPhoto.filename
                  : coach.user.avatar.filename
              )}
              categories={coach.areas.map((item) => (typeof item === 'string' ? item : item.name))}
              name={coach.user.firstName}
            />
          </div>
        ))
      ) : (
        <div className={styles.emptyFollow}>{t('favorite_coaches_empty_follow')}</div>
      )}
    </div>
  );
};
export default FavoriteCoaches;
