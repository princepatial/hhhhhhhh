import styles from './CoachBigTile.module.scss';
import { useMemo } from 'react';
import FavoriteHeart from 'components/FavoriteHeart';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { getGlobalState } from 'globalState';
import AvatarWithStatus from 'components/AvatarWithStatus';
import { Category } from 'globalTypes';
import { useRouter } from 'next/router';

type Props = {
  imageSrc: string;
  name: string;
  categories: string[] | Category[];
  isCoachSign?: boolean;
  id?: string;
  categoriesClass?: string;
  isFollowCoach?: boolean;
};

const CoachBigTile = ({
  imageSrc,
  name,
  categories,
  isCoachSign,
  id,
  categoriesClass,
  isFollowCoach
}: Props) => {
  const slicedCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const user = getGlobalState('user');
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <div
      className={classNames(styles.container, id && styles.cursor)}
      onClick={() => id && router.push(`/coaches?id=${id}`)}>
      <div className={styles.imageWrapper}>
        {id && <AvatarWithStatus imageSrc={imageSrc} userId={id} />}
      </div>
      <div className={styles.smallDescription}>
        <div className={styles.nameCategories}>
          <div className={styles.nameStatus}>
            <span className={styles.name}>{name}</span>
            {isCoachSign && <span className={styles.coach}> H2HCoach</span>}
          </div>
          <div className={styles.categories}>
            {slicedCategories.map((item, index) => {
              return (
                <span
                  className={classNames(categoriesClass, styles.item)}
                  key={typeof item === 'string' ? index : item._id}>
                  {t(typeof item === 'string' ? item : item.name)}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.onlineFavourite} onClick={(e) => e.stopPropagation()}>
          <div>
            {id && user && <FavoriteHeart isFollowCoach={isFollowCoach} key={id} id={id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachBigTile;
