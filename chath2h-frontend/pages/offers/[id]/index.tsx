import SinglePage from '@components/NeedsAndOffer/SinglePage';
import styles from './singleOffer.module.scss';
import { useSingleNeedOffer } from 'queries/singleNeedOfferQuery';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const Offer = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;

  const { data, status, error, refetch, isFetched } = useSingleNeedOffer(id);

  useEffect(() => {
    if (isFetched && (!id || !data)) {
      router.push('/');
    }
  }, [id, data, isFetched]);

  return (
    <div className={styles.container}>
      {!id || !data ? (
        <div className={styles.notExist}>{t('offers_not_exist')}</div>
      ) : (
        <SinglePage error={error} status={status} data={data} id={id} refetch={refetch} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Offer;
