import SinglePage from '@components/NeedsAndOffer/SinglePage';
import styles from '../../offers/[id]/singleOffer.module.scss';
import { useSingleNeedOffer } from 'queries/singleNeedOfferQuery';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const Need = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
        <div className={styles.notExist}>{t('needs_not_exist')}</div>
      ) : (
        <SinglePage error={error} status={status} data={data} isNeed id={id} refetch={refetch} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Need;
