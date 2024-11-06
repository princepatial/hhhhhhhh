import styles from './EmptyMyWork.module.scss';
import Image from 'next/image';
import EmptyNeed from '@images/needsEmpty.png';
import EmptyOffer from '@images/offersEmpty.png';
import AddButton from 'components/NeedsAndOffer/AddButton';

const EmptyMyWork = ({ isNeed }: { isNeed?: boolean }) => {
  return (
    <div className={styles.container}>
      <div className={styles.emptyImage}>
        <Image
          src={isNeed ? EmptyNeed : EmptyOffer}
          alt={isNeed ? 'Empty Needs Image' : 'Empty Offers Image'}
          fill
        />
      </div>
      <span className={styles.text}>
        {isNeed ? 'Add a need if you need help.' : 'Add an offer if you want to help someone.'}
      </span>
      <AddButton
        color={isNeed ? 'red' : 'limeGreen'}
        text={isNeed ? 'Add a need' : 'Add an offer'}
      />
    </div>
  );
};

export default EmptyMyWork;
