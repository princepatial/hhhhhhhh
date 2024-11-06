import EmailForm from 'components/Authorization/EmailForm';
import { useRouter } from 'next/router';
import { useAuthorization } from 'queries/authorizationQuery';
import { useEffect } from 'react';
import styles from './authorization.module.scss';
import authorizationPageImg from '@images/authorization_page.png';
import Image from 'next/image';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {setGlobalStateUser, useGlobalState} from 'globalState';
import { getAuthMe } from 'queries/authorizationQuery/authorization';
import { socket } from 'socket';

const Authorization = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const token = router.query.token;
  const redirectUri = router.query.redirectUri;
  const { data: userId, isFetching } = useAuthorization(router, token);
  const { t } = useTranslation('common');
  const [language] = useGlobalState('language');

  useEffect(() => {
    if (userId) {
      if (redirectUri) location.href = redirectUri.toString();
      else {
        getAuthMe().then((authMeData) => {
          setGlobalStateUser(authMeData);
          socket.emit('setStatus', 'Online');
          socket.emit('getOnlineUsers');
          location.href = `/${language.value}/dashboard`;
        });
      }
    }
  }, [userId]);

  return (
    <div className={styles.container}>
      <Image src={authorizationPageImg} alt="authorization" className={styles.backgroundImg} />
      {isFetching ? (
        <div className={styles.info}>{t('Authorization_wait_for_authorization')}</div>
      ) : (
        <EmailForm />
      )}
    </div>
  );
};

export default Authorization;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
