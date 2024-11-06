import styles from './FavoriteHeart.module.scss';
import Image from 'next/image';
import heartGreen from '@images/heartGreen.svg';
import heart from '@images/heart.svg';
import { updateFavoriteCoach } from 'queries/coachQuery/coach';
import { useState } from 'react';

type Props = {
  id: string;
  isFollowCoach?: boolean;
};

const FavoriteHeart = ({ id, isFollowCoach }: Props) => {
  const [isFollow, setIsFollow] = useState(isFollowCoach || false);
  const onClick = () => {
    updateFavoriteCoach(id).then(() => {
      setIsFollow((prevState) => !prevState);
    });
  };
  return (
    <button onClick={onClick} className={styles.container}>
      {isFollow ? <Image src={heartGreen} alt="heart-green" /> : <Image src={heart} alt="heart" />}
    </button>
  );
};

export default FavoriteHeart;
