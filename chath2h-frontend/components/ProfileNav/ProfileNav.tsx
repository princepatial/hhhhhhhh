import { EnvelopeIconComponent } from '@components/icons';
import colorScheme from '@helpers/color-scheme';
import becomeCoach from '@images/BecomeCoach.svg';
import classNames from 'classnames';
import { useGlobalState } from 'globalState';
import { Photo } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import router from 'next/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import Box from './Box';
import styles from './ProfileNav.module.scss';
import axios from 'axios';
import { useEffect, useState } from 'react';

type Props = {
  avatar: Photo;
  firstName: string;
  style?: string;
};

const ProfileNav = ({ avatar, firstName, style }: Props) => {
  const { t } = useTranslation('common');
  const src = useImageUrl(avatar.filename);
  const [user] = useGlobalState('user');
  const [unreadMessagesCount] = useGlobalState('unreadMessagesCount');
  const [isCoachProfile] = useGlobalState('isCoachProfile');
  const [referralLink, setReferralLink] = useState<string>('');
  const goToMailbox = () => router.push('/mailbox');
  const gotToMyTokens = () => router.push('/dashboard/my-tokens');
  const goToMyOffers = () => router.push('/dashboard/my-work?#offers');
  const gotToMyNeeds = () => router.push('/dashboard/my-work?#needs');
  const goToAreas = () => router.push('/areas');

  useEffect(() => {
    if (user?.refLink) {
      setReferralLink(user?.refLink);
    }
  }, [user?.refLink]);

  const getReferralLink = async () => {
    if (!referralLink) {
      try {
        const { data } = await axios.patch('/users/ref-link');
        setReferralLink(data);
      } catch (error) {
        console.log(error);
      }
    }
    toast.success(t('dashboard_toast_clipboard_copied'));
  };

  return (
    <div className={classNames(styles.profile, style)}>
      <div className={styles.person}>
        <div className={styles.text}>
          <span className={styles.title}>
            {t('dashboard_welcome')} {firstName}!
          </span>
        </div>
        <div className={styles.image}>
          <Image
            className={styles.styleImage}
            alt="User Avatar"
            width={72}
            height={71}
            src={src}
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
      {!isCoachProfile ? (
        <Box onClick={goToAreas}>
          <div className={styles.earnMoney}>
            <div className={styles.title}>
              <div className={styles.text}>{t('dashboard_earn')}</div>
              <div className={styles.imageAnim}>
                <Image width={42} height={46} alt="Become Coach Image" src={becomeCoach}></Image>
              </div>
            </div>
            <div className={styles.description}>{t('dashboard_earn_description')}</div>
            <div className={styles.link}>{t('dashboard_earn_link')}</div>
          </div>
        </Box>
      ) : null}
      <Box onClick={!user?.isDisabled ? goToMailbox : () => {}} active={!user?.isDisabled}>
        <div className={styles.mailBox}>
          <div className={styles.text}>
            <span className={styles.title}>{t('dashboard_mailBox')}</span>
            <span className={classNames(styles.description, unreadMessagesCount && styles.red)}>
              {unreadMessagesCount + ' ' + t('dashboard_mailBox_new_messages')}
            </span>
          </div>
          <div className={styles.envelop}>
            {unreadMessagesCount ? <div className={styles.dot} /> : null}
            <EnvelopeIconComponent width={30} height={25} color={colorScheme.green} />
          </div>
        </div>
      </Box>
      <div className={styles.wrapperBox}>
        <Box onClick={gotToMyNeeds}>
          <div className={styles.title}>{t('dashboard_myNeeds')}</div>
          <div className={styles.description}>{t('dashboard_myNeeds_description')}</div>
        </Box>
        <Box active={isCoachProfile} onClick={isCoachProfile ? goToMyOffers : () => {}}>
          <div className={styles.title}>{t('dashboard_myOffers')}</div>
          <div className={styles.description}>
            {!isCoachProfile ? t('dashboard_myOffers_unlock') : t('dashboard_myOffers_description')}
          </div>
        </Box>
      </div>
      <Box>
        <div className={styles.myTokenBox} onClick={gotToMyTokens}>
          <div className={styles.title}>{t('dashboard_myTokens')}</div>
          <div className={styles.description}>{t('dashboard_myTokens_description')}</div>
        </div>
      </Box>
      <CopyToClipboard text={referralLink} onCopy={getReferralLink}>
        <Box>
          <div className={styles.myTokenBox}>
            <div className={styles.title}>{t('dashboard_invite_friend')}</div>
            <div className={styles.description}>{t('dashboard_invite_friend_description')}</div>
          </div>
        </Box>
      </CopyToClipboard>
      <Box onClick={goToAreas}>
        <div className={styles.myTokenBox}>
          <div className={styles.title}>{t('dashboard_to_areas')}</div>
          <div className={styles.description}>{t('dashboard_to_areas_description')}</div>
        </div>
      </Box>
    </div>
  );
};

export default ProfileNav;
