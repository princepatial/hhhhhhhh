import Button from '@components/Button';
import FavoriteCoaches from 'components/FavoriteCoaches';
import LastViewedSection from 'components/LastViewedSection';
import DashboardMyWork from 'components/NeedsAndOffer/DashboardMyWork';
import ProfileNav from 'components/ProfileNav';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import router from 'next/router';
import { useDashboard } from 'queries/dashboardQuery';
import styles from './dashboard.module.scss';
import DashboardSuggested from '@components/NeedsAndOffer/DashboardSuggested';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

const Dashboard = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = useDashboard();
  const { t } = useTranslation('common');

  if (!data) return null;

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <ProfileNav firstName={data.firstName} avatar={data.avatar} />
      </div>
      <div className={styles.topTextMobile}>
        <span className={styles.text}>{t('dashboard_new_need_text')}</span>
        <Button
          style={styles.button}
          text={t('dashboard_new_need_button')}
          buttonColor="green"
          onClick={() => router.push('/areas')}
        />
      </div>

      <div className={styles.mainContent}>
        <DashboardMyWork isNeed items={data.myNeedsAndOffers?.needs?.slice(0, 3)}></DashboardMyWork>
        <DashboardMyWork items={data.myNeedsAndOffers?.offers?.slice(0, 3)}></DashboardMyWork>
        <DashboardSuggested isNeed items={data.suggestedNeeds}></DashboardSuggested>
        <DashboardSuggested items={data.suggestedOffers}></DashboardSuggested>
      </div>
      <div className={styles.lastFavorite}>
        <div className={styles.topText}>
          <span className={styles.text}>{t('dashboard_new_need_text')}</span>
          <Button
            style={styles.button}
            text={t('dashboard_new_need_button')}
            buttonColor="green"
            onClick={() => router.push('/areas')}
          />
        </div>
        <div className={styles.lastViewWrapper}>
          <span className={styles.lastView}>{t('dashboard_lastViewed')}</span>
          <LastViewedSection lastViewedItems={data.lastViewedUrls} />
        </div>
        <FavoriteCoaches
          coaches={data.favoriteCoaches}
          categoriesClass={styles.categoriesTextStyle}
        />
      </div>
    </div>
  );
};

export default Dashboard;
