import { ActiveComponents, CoachesWithCategories, StateSetterType } from 'globalTypes';
import CoachTile from 'components/Coach/CoachTile';
import styles from './CoachTileRow.module.scss';

type Props = {
  coaches: CoachesWithCategories[];
  setActiveCoach: StateSetterType<CoachesWithCategories | null>;
  setActiveComponent: StateSetterType<ActiveComponents>;
  index: number;
};

const CoachTileRow = ({ setActiveCoach, setActiveComponent, coaches }: Props) => {
  return (
    <div className={styles.coach}>
      {coaches.map((coach, index) => {
        const { _id, avatar, coachProfile, firstName } = coach.user;
        return (
          <CoachTile
            key={_id}
            avatar={coachProfile.coachPhoto ? coachProfile.coachPhoto : avatar}
            name={firstName}
            index={index}
            onClick={() => {
              setActiveComponent('coachDetails');
              setActiveCoach(coach);
            }}
          />
        );
      })}
    </div>
  );
};

export default CoachTileRow;
