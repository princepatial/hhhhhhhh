import { ChevronRightIconComponent, NavBarIconComponent } from '@components/icons';
import colorScheme from '@helpers/color-scheme';
import { NavMenuItem } from '@interfaces/nav-menu-item.interface';
import classNames from 'classnames';
import { useGlobalState } from 'globalState';
import { Language, User } from 'globalTypes';
import { languageOptions } from 'helpers';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';
import styles from './drawer.module.scss';
import ConnectToWallet from '@components/ConnectToWallet';

interface DrawerComponentProps {
  menuList: Array<NavMenuItem>;
  setMobileMenuOpened: (value: boolean) => void;
  logoutUserEvent?: () => void;
  user?: User;
}

const DrawerComponent = ({
  menuList,
  setMobileMenuOpened,
  logoutUserEvent,
  user
}: DrawerComponentProps) => {
  const [languageMenuOpened, setLanguageMenuOpened] = useState(false);
  const [language, setLanguage] = useGlobalState('language');
  const { t } = useTranslation('common');

  const closeMenu = () => {
    setMobileMenuOpened(false);
    setLanguageMenuOpened(false);
  };

  const handleSelectLanguage = (language: Language) => {
    if (language) {
      setLanguage(language);
      router.replace(router.pathname, router.pathname, { locale: language.value });
    }
    closeMenu();
  };

  return (
    <div className={classNames(styles.drawer)}>
      <div className={styles.drawer__header}>
        <h3>Menu</h3>
        <NavBarIconComponent onClick={closeMenu} isOpened={true} />
      </div>
      <div className={styles.drawer__menu}>
        <div
          className={styles.drawer__menu__item}
          style={{ transform: `translate(-${+languageMenuOpened * 100}%)` }}>
          {menuList.map((menu, id) => {
            const isActive = router.pathname.includes(menu.href);
            return (
              <Link
                key={id}
                onClick={closeMenu}
                className={classNames(styles.mobileItem, isActive && styles.active)}
                href={menu.href}
                target={menu.href.includes('https') ? '_blank' : '_self'}>
                {menu.text}
              </Link>
            );
          })}

          <div
            onClick={() => setLanguageMenuOpened(true)}
            className={classNames(styles.mobileItem)}>
            <div>
              {t('drawer-language')} {language.label}
            </div>
            <div className={styles.pointer}>
              <ChevronRightIconComponent />
            </div>
          </div>

          <ConnectToWallet isMobile style={styles.wallet} />

          {user && (
            <span
              className={classNames(styles.mobileItem, styles.pointer)}
              onClick={() => {
                if (!logoutUserEvent) return;
                setMobileMenuOpened(false);
                logoutUserEvent();
              }}>
              Logout
            </span>
          )}
        </div>
        <div
          className={styles.drawer__menu__item}
          style={{ transform: `translate(-${+languageMenuOpened * 100}%)` }}>
          <div className={styles.back} onClick={(e) => setLanguageMenuOpened(false)}>
            <ChevronRightIconComponent direction={'left'} color={colorScheme.turquoise} />
            <span>{t('drawer-back')}</span>
          </div>
          {languageOptions.map((language) => (
            <div
              key={language.value}
              onClick={() => handleSelectLanguage(language)}
              className={classNames(styles.mobileItem)}>
              <div>{language.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawerComponent;
