import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import styles from './CookiesComponent.module.scss';
import React, { useState } from 'react';
import Button from '@components/Button';
import Dialog from '@components/Dialog';

const cookieName = 'acceptCookies';
const expiresCookies = 100;
const settingsCookies = { expires: expiresCookies };

const CookiesComponent = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const buttonStyle = {
    background: '#39aba4',
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: '600'
  };

  const onClickButtonDialog = (booleanValue: boolean) => {
    setIsDialogOpen(false);
    Cookies.set(cookieName, booleanValue, settingsCookies);
    setIsHidden(true);
  };

  return (
    <>
      <Dialog isOpen={isDialogOpen} handleClose={() => setIsDialogOpen(false)}>
        <div className={styles.dialog}>
          <div className={styles.privacy}>
            <Link className={styles.textTop} href={'/privacy-policy'} target="_blank">
              {t('CookiesComponent_privacy-overview')}
            </Link>

            <Link href={'https://gdpr.eu/cookies/'} target="_blank">
              {t('CookiesComponent_cookies-link')}
            </Link>
          </div>

          <div className={styles.overview}>
            <h2>{t('CookiesComponent_privacy-overview')}</h2>
            <br></br>
            <span>{t('CookiesComponent_cookies-text')}</span>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className={styles.buttons}>
              <Button
                text={t('CookiesComponent_enable')}
                onClick={() => onClickButtonDialog(true)}
              />
              <Button
                text={t('CookiesComponent_reject')}
                onClick={() => onClickButtonDialog(false)}
              />
              <Button text={t('CookiesComponent_save')} onClick={() => setIsDialogOpen(false)} />
            </div>
          </div>
        </div>
      </Dialog>
      <CookieConsent
        visible={isHidden ? 'hidden' : undefined}
        location="bottom"
        buttonText={t('Cookie_accept')}
        enableDeclineButton
        declineButtonText={t('Cookie_decline')}
        cookieName={cookieName}
        expires={expiresCookies}
        flipButtons
        buttonWrapperClasses={styles.buttonWrapper}
        ButtonComponent={Button}
        contentStyle={{ flex: 'unset' }}
        style={{
          background: '#ffffff',
          color: '#141414',
          fontSize: '12px',
          boxShadow: '0px 10px 5px #afafaf',
          fontWeight: '300',
          justifyContent: 'center'
        }}
        buttonStyle={buttonStyle}>
        <>
          {t('Cookie_main-text')}&nbsp;
          <div>
            <span style={{ fontSize: '12px' }}>{t('Cookie_second-text')}&nbsp;</span>

            <span
              onClick={() => setIsDialogOpen(true)}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#39aba4',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}>
              {t('Cookie_second-link')}
            </span>
          </div>
        </>
      </CookieConsent>
    </>
  );
};
export default CookiesComponent;
