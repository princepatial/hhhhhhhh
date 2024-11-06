import CategoriesHelp from '@components/HelpCentre/CategoriesHelp';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import styles from './helpCategories.module.scss';
import HelpNav from '@components/HelpCentre/HelpNav';

const CategoriesHelpPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className={styles.container}>
      <HelpNav />
      <CategoriesHelp />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default CategoriesHelpPage;
