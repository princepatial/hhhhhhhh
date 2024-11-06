import starImg from '@images/star.svg';
import { SingleCoach } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import Image from 'next/image';
import styles from './SingleCoach.module.scss';

type Props = {
  data: SingleCoach;
};

const SingleCoach = ({ data }: Props) => {
  const {
    coachProfile: {
      coachPhoto: { filename }
    },
    firstName,
    rate,
    ratingsCount
  } = data;

  const image = useImageUrl(filename);

  return (
    <div className={styles.container}>
      <Image
        alt={`top coach ${firstName}`}
        src={image}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        className={styles.avatar}
        width={150}
        height={150}
      />
      <span className={styles.name}>{firstName}</span>
      <div className={styles.rating}>
        <Image
          alt="star"
          src={starImg}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          className={styles.starImg}
        />
        <div className={styles.stars}>{rate.toFixed(1)}</div>
        <div className={styles.ratingsCount}>({ratingsCount})</div>
      </div>
    </div>
  );
};

export default SingleCoach;
