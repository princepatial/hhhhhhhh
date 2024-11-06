import { useRouter } from 'next/router';
import Button from '@components/Button';
import styles from './AddButton.module.scss';
import { ButtonColor } from 'globalTypes';

type Props = {
  text: string;
  color?: ButtonColor;
  offerCheckIsCoach?: (isOpen: boolean) => void;
};

const AddButton = ({ text, color, offerCheckIsCoach }: Props) => {
  const router = useRouter();
  const onClickEvent = () => {
    offerCheckIsCoach ? offerCheckIsCoach(true) : router.push('/areas');
  };

  return (
    <Button
      style={styles.button}
      onClick={onClickEvent}
      text={text}
      buttonColor={color || 'green'}
    />
  );
};

export default AddButton;
