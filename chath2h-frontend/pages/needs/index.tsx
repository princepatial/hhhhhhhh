import NeedsAndOffer from 'components/NeedsAndOffer/';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

const Needs = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <NeedsAndOffer
      isNeedPage
      id={typeof router?.query?.id === 'string' ? router?.query?.id : undefined}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Needs;
