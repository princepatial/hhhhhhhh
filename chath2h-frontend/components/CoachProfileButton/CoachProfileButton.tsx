import Dialog from '@components/Dialog';
import CreateCoachProfile from 'components/CoachProfileForm';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import styles from './CoachProfileButton.module.scss';
import Button from '@components/Button';

const CoachProfileButton = () => {
  const { t } = useTranslation('common');
  const [isCreateCoachDialogOpen, setIsCreateCoachDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        style={styles.dialog}
        isOpen={isCreateCoachDialogOpen}
        title={t('SingleArea_create_coach_profile')}
        handleClose={() => setIsCreateCoachDialogOpen(false)}>
        <div className={styles.coachProfileForm}>
          <CreateCoachProfile handleCancel={() => setIsCreateCoachDialogOpen(false)} />
        </div>
      </Dialog>
      <div className={styles.startChat}>
        <span>{t('DetailsWrapper_start-chat_text')}</span>
        <Button
          onClick={() => setIsCreateCoachDialogOpen(true)}
          text={t('DetailsWrapper_start-chat_button')}
        />
      </div>
    </>
  );
};

export default CoachProfileButton;
