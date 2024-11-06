import styles from './CoachDetails.module.scss';
import { Photo } from 'globalTypes';
import CoachBigTile from 'components/Coach/CoachBigTile';
import useImageUrl from 'hooks/getImageUrl';

type Props = {
  avatar: Photo;
  coachPhoto?: Photo;
  name: string;
  about: string;
  competence: string;
  categories: string[];
  id: string;
  isFollowCoach?: boolean;
};

const CoachDetails = ({
  avatar,
  coachPhoto,
  name,
  about,
  competence,
  categories,
  id,
  isFollowCoach
}: Props) => {
  return (
    <div className={styles.container}>
      <CoachBigTile
        isFollowCoach={isFollowCoach}
        imageSrc={useImageUrl(coachPhoto?.filename || avatar.filename)}
        name={name}
        categories={categories}
        isCoachSign
        id={id}
      />
      <span className={styles.about}>{about}</span>
      <span className={styles.competence}>{competence}</span>
    </div>
  );
};

export default CoachDetails;
