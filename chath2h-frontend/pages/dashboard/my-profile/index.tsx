import Register from 'components/Authorization/Register';
import CreateCoachProfile from 'components/CoachProfileForm';
import { useGlobalState } from 'globalState';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import styles from './myProfile.module.scss';
import Button from '@components/Button';

const MyProfile = () => {
  const router = useRouter();
  const [user] = useGlobalState('user');
  const { t } = useTranslation('common');
  const handleCancel = () => {
    router.push('/dashboard');
  };

  const onDeleteAccount = () => {
    window.location.href = 'mailto:info@chath2h.com?subject=Delete Account';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('my-profile_profile')}</h1>
      <div className={styles.subtitle}>{t('my-profile_edit_personal')}</div>
      <Register isEdit handleCancel={handleCancel} />
      {user?.coachProfile ? (
        <>
          <div className={styles.subtitle}>{t('my-profile_edit_coach')}</div>
          <div className={styles.coachProfileForm}>
            <CreateCoachProfile isEdit handleCancel={handleCancel} />
          </div>
        </>
      ) : null}
      <div className={styles.deleteAccount}>
        <div className={styles.title}>
          <span>{t('my-profile_delete-text')}</span>
        </div>

        <p>{t('my-profile_delete-description')}</p>
        <Button
          buttonColor="red"
          text={t('my-profile_delete-button')}
          onClick={() => onDeleteAccount()}
        />
      </div>
    </div>
  );
};

export default MyProfile;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
