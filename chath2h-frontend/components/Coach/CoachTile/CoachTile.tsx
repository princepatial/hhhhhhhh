import { MouseEventHandler } from 'react';
import styles from './CoachTile.module.scss';
import { Photo } from 'globalTypes';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';

type Props = {
  avatar: Photo;
  name: string;
  index: number;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const CoachTile = ({ avatar, name, index, onClick }: Props) => {
  const { filename } = avatar || {};
  const imageSrc = useImageUrl(filename);
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.image}>
        <Image
          style={{ objectFit: 'cover' }}
          src={imageSrc}
          width={36}
          height={36}
          className={styles.imageStyle}
          alt={index + '-coachTile'}
        />
      </div>
      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.category}>H2HCoach</span>
      </div>
    </div>
  );
};

export default CoachTile;
