import Button from '@components/Button';
import deleteIcon from '@images/delete.svg';
import { useTranslation } from 'next-i18next';
import IconButton from '@components/NeedsAndOffer/IconButton';
import styles from './DeleteResolvedButtons.module.scss';

type Props = {
  onResolvedDelete: (isDelete: boolean) => void;
  isActive: boolean;
  isNeed: boolean;
};

const DeleteResolvedButtons = ({ onResolvedDelete, isActive, isNeed }: Props) => {
  const { t } = useTranslation('common');
  return (
    <>
      <Button
        style={styles.button}
        text={t(`MyWork_button_delete_${isNeed ? 'need' : 'offer'}`)}
        buttonColor="whiteRed"
        onClick={() => {
          onResolvedDelete(false);
        }}>
        <IconButton alt="deleteIcon" icon={deleteIcon} />
      </Button>
      <Button
        onClick={() => onResolvedDelete(true)}
        text={t(isActive ? 'MyWork_button_resolved' : 'MyWork_button_active')}
        buttonColor="whiteGreen"
      />
    </>
  );
};

export default DeleteResolvedButtons;
