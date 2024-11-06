import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Footer.module.scss';

const allowFooterPaths = [
  '/',
  '/impressum',
  '/privacy-policy',
  '/agb',
  '/help',
  '/help/tokens',
  '/help/categories',
  '/mission'
];

const Footer = () => {
  const [showFooter, setShowFooter] = useState(true);

  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (allowFooterPaths.includes(router.pathname)) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  }, [router.pathname]);

  const currentYear = new Date().getFullYear();
  return showFooter ? (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>H2H © {currentYear}</div>
        <div className={styles.links}>
          <Link href="/help">{t('Footer_link_help')}</Link>
          <Link href="/agb">{t('Footer_link_agb')}</Link>
          <Link href="/impressum">{t('Footer_link_impressum')}</Link>
          <Link href="/privacy-policy">{t('Footer_link_privacy_policy')}</Link>
          <Link href="/mission">{t('Footer_link_mission')}</Link>
        </div>
      </div>
    </footer>
  ) : (
    <></>
  );
};

export default Footer;
