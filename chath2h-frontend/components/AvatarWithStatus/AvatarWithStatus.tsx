import UserActivityStatus from 'components/UserActivityStatus';
import styles from './AvatarWithStatus.module.scss';
import Image from 'next/image';

type Props = {
  imageSrc: string;
  userId?: string;
};

const AvatarWithStatus = ({ imageSrc, userId }: Props) => {
  return (
    <div className={styles.container}>
      <Image
        className={styles.avatar}
        style={{ objectFit: 'cover' }}
        src={imageSrc}
        width={56}
        height={56}
        alt="user avatar"
      />
      {userId && <UserActivityStatus userId={userId} className={styles.status} />}
    </div>
  );
};

export default AvatarWithStatus;
