import styles from './Tile.module.scss';
import { MouseEventHandler } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';

const breakWordNumber = 110;

type Props = {
  index: number;
  onClick: MouseEventHandler<HTMLDivElement>;
  isNeed?: boolean;
  description: string;
  problemTitle: string;
  imageSrc: string;
  firstName: string;
  category: string;
  time: Date | null;
  userId: string;
  onCoachNameClick: MouseEventHandler<HTMLDivElement>;
};

const Tile = ({
  userId,
  onClick,
  isNeed,
  description,
  imageSrc,
  firstName,
  category,
  time,
  problemTitle,
  onCoachNameClick
}: Props) => {
  const { t } = useTranslation('common');
  const descriptionSpliced = description.substring(0, breakWordNumber);
  const image = useImageUrl(imageSrc);
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <Image
          className={classNames(styles.tileImage, isNeed ? styles.borderRed : styles.borderGreen)}
          style={{ objectFit: 'cover' }}
          src={image}
          width={101}
          height={101}
          alt="tile image"
        />
      </div>
      <div className={styles.data}>
        <div className={styles.topText}>
          <div className={styles.name}>
            {isNeed ? (
              <span>{firstName}</span>
            ) : (
              <>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onCoachNameClick(e);
                  }}>
                  {firstName}
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <span className={classNames(styles.category, isNeed ? styles.red : styles.green)}>
            {t(category)}
          </span>
          <span className={styles.problemTitle}>{problemTitle}</span>
        </div>

        <span className={styles.description}>
          {description.length > breakWordNumber ? descriptionSpliced + '...' : description}
          <button className={classNames(styles.button, isNeed ? styles.red : styles.green)}>
            {t('Tile_read_more')}
          </button>
        </span>
      </div>
    </div>
  );
};

export default Tile;
