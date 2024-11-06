import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './mission.module.scss';

export default function MissionPage() {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <div className={styles.video}>
        <video src="/asia_720.mp4" autoPlay loop muted />
      </div>
      <div className={styles.content}>
        <div className={styles.paragraph}>
          <div className={styles.title}>{t('Mission_our_mission')}:</div>
          <div>{t('Mission_our_mission_description')}</div>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.title}>{t('Mission_vision')}:</div>
          <div>{t('Mission_vision_description')}</div>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.title}>{t('Mission_storytelling')}:</div>
          <div>{t('Mission_storytelling_description_our_home')}</div>
          <p>{t('Mission_storytelling_description_1')}</p>
          <p>
            {t('Mission_storytelling_description_2')}
            <br />
            {t('Mission_storytelling_description_only_human')}
            <br />
            {t('Mission_storytelling_description_power')}
          </p>
          <p>{t('Mission_storytelling_description_4')}</p>
          <div>{t('Mission_storytelling_description_alone')}:</div>
          <p>{t('Mission_storytelling_description_5')}</p>
          <div>{t('Mission_storytelling_description_reason')}</div>
          <div className={styles.center}>ChatH2H</div>
          <div>{t('Mission_h2h_1')}</div>
          <div>{t('Mission_h2h_2')}</div>
          <div>{t('Mission_h2h_3')}</div>
          <div>{t('Mission_h2h_4')}</div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
