import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import styles from './HelpNav.module.scss';

enum Nav {
  HELP_CATEGORIES = '/help/categories',
  HELP_CENTER = '/help',
  H2H_TOKENS = '/help/tokens'
}

const HelpNav = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isCategories = router.pathname === Nav.HELP_CATEGORIES;
  const isHelpCenter = router.pathname === Nav.HELP_CENTER;
  const isTokensCenter = router.pathname === Nav.H2H_TOKENS;

  return (
    <div className={styles.container}>
      <Link
        className={classNames(styles.link, isHelpCenter && styles.active)}
        href={Nav.HELP_CENTER}>
        {t('HelpNav_link_help')}
      </Link>
      <Link
        className={classNames(styles.link, isCategories && styles.active)}
        href={Nav.HELP_CATEGORIES}>
        {t('HelpNav_link_help_categories')}
      </Link>
      <Link
        className={classNames(styles.link, isTokensCenter && styles.active)}
        href={Nav.H2H_TOKENS}>
        {t('HelpNav_link_help_tokens')}
      </Link>
    </div>
  );
};

export default HelpNav;
