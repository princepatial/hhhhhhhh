import classNames from 'classnames';
import styles from '../Item.module.scss';
import Image from 'next/image';
import checkedImage from '@images/checked.svg';

type Props = {
  onClick?: () => void;
  isActive?: boolean;
  text: string | number;
};

const OptionItem = ({ onClick, isActive = false, text }: Props) => {
  return (
    <div
      className={classNames(styles.item, styles.subItem, isActive && styles.backgroundSilver)}
      onClick={onClick}>
      <span>{text}</span>
      <div className={styles.image}>
        {isActive && <Image src={checkedImage} alt="checked" fill />}
      </div>
    </div>
  );
};

export default OptionItem;
