import Wrapper from '@components/Authorization/Wrapper';
import authorizationPageImg from '@images/authorization_page.png';
import Register from 'components/Authorization/Register';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from './register.module.scss';

const RegisterPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const handleCancel = () => {
    router.replace('/');
  };

  return (
    <div className={styles.container}>
      <Image src={authorizationPageImg} alt="authorization" className={styles.backgroundImg} />
      <Wrapper stylesWrapper={styles.wrapper} stylesBox={styles.box} title={'Personal data form'}>
        <Register handleCancel={handleCancel} />
      </Wrapper>
    </div>
  );
};

export default RegisterPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
