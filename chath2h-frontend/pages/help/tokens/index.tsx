import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import styles from '../helpCenter.module.scss';
import HelpNav from '@components/HelpCentre/HelpNav';
import { useTranslation } from 'next-i18next';
import stylesToken from './tokens.module.scss';
import Link from 'next/link';

const CategoriesHelpPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <HelpNav />
      <div className={styles.helpContent}>
        <div className={styles.topText}>
          <h1 className={styles.title}>{t('CategoriesHelpPage_title')}</h1>

          <h2 className={styles.subtitle}>{t('CategoriesHelpPage_subtitle')}</h2>
        </div>

        <span>{t('CategoriesHelpPage_description')}</span>

        <h2 className={styles.subtitle}>{t('CategoriesHelpPage_target1_title')}</h2>
        <span>{t('CategoriesHelpPage_target1_text')}</span>
        <br></br>
        <ul className={stylesToken.list}>
          <li>{t('CategoriesHelpPage_target1_list_1')}</li>
          <li>{t('CategoriesHelpPage_target1_list_2')}</li>
          <li>{t('CategoriesHelpPage_target1_list_3')}</li>
          <li>{t('CategoriesHelpPage_target1_list_4')}</li>
          <li>{t('CategoriesHelpPage_target1_list_5')}</li>
          <li>{t('CategoriesHelpPage_target1_list_6')}</li>
        </ul>
        <br></br>
        <span>{t('CategoriesHelpPage_target1_text_2')}</span>
        <br></br>
        <br></br>
        <span>{t('CategoriesHelpPage_target1_text_3')}</span>

        <h2 className={styles.subtitle}>{t('CategoriesHelpPage_furtherDevelopment')}</h2>

        <span>{t('CategoriesHelpPage_furtherDevelopment_text_1')}</span>
        <br></br>
        <span>
          {t('CategoriesHelpPage_furtherDevelopment_text_2')}&nbsp;
          <Link
            className={stylesToken.link}
            href={'https://www.moneyland.ch/de/kryptowaehrungen-Kurse-preise-Factors.'}>
            https://www.moneyland.ch/de/kryptowaehrungen-Kurse-preise-Factors.
          </Link>
        </span>
        <br></br>
        <span>{t('CategoriesHelpPage_furtherDevelopment_text_3')}</span>
        <br></br>
        <br></br>
        <span>{t('CategoriesHelpPage_furtherDevelopment_text_4')}</span>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default CategoriesHelpPage;
