import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './NavBar.module.scss';
import { useEffect, useState } from 'react';
import { NavBarIconComponent } from '@components/icons';
import { NavMenuItem } from '@interfaces/nav-menu-item.interface';
import DrawerComponent from '@components/Header/blocks/drawer/drawer.component';
import colorScheme from '@helpers/color-scheme';
import { useTranslation } from 'next-i18next';
import { User } from 'globalTypes';

type NavBarProps = {
  isHomePage: boolean;
  isAuthPage: boolean;
  isMobile?: boolean;
  logoutUserEvent?: () => void;
  user?: User;
};

const NavBar = ({ isHomePage, isAuthPage, isMobile, logoutUserEvent, user }: NavBarProps) => {
  const router = useRouter();
  const [menuList, setMenuList] = useState<Array<NavMenuItem>>([]);
  const [mobileList, setMobileList] = useState<Array<NavMenuItem>>([]);
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);
  const { t } = useTranslation('common');
  const defaultPages = [
    { text: t('Dashboard_navigation_title'), href: '/dashboard' },
    { text: t('Needs_navigation_title'), href: '/needs' },
    { text: t('Offers_navigation_title'), href: '/offers' },
    { text: t('Coaches_navigation_title'), href: '/coaches' }
  ];

  const additionalPages = [
    { text: t('nav_mission'), href: '/mission' },
    { text: t('nav_help_center'), href: '/help' },
    { text: t('nav_categories'), href: '/areas' }
  ];

  const settingsPage = { text: t('Header_settings'), href: '/dashboard/my-profile' };

  useEffect(() => {
    if (isAuthPage) {
      setMenuList([]);
    } else if (router.pathname === '/') {
      setMenuList(additionalPages);
      setMobileList(additionalPages);
    } else {
      setMenuList(defaultPages);
      setMobileList([...defaultPages, settingsPage, ...additionalPages]);
    }
  }, [router.pathname, isAuthPage]);

  const DesktopNavBar = () => {
    return (
      <div className={classNames(styles.container, !isHomePage && styles.container__center)}>
        {menuList.map((menu, id) => {
          const isActive = router.pathname.includes(menu.href);

          return (
            <Link
              key={id}
              className={classNames(
                styles.item,
                isHomePage && styles.homePage,
                isActive && styles.active
              )}
              href={menu.href}
              target={menu.href.includes('https') ? '_blank' : '_self'}>
              {menu.text}
            </Link>
          );
        })}
      </div>
    );
  };

  const MobileNavBar = () => {
    return (
      <>
        <div className={styles.mobileContainer}>
          <NavBarIconComponent
            onClick={() => setMobileMenuOpened(!mobileMenuOpened)}
            color={isHomePage ? colorScheme.white : colorScheme.black}
            isOpened={false}
          />
        </div>
        {mobileMenuOpened && (
          <DrawerComponent
            setMobileMenuOpened={setMobileMenuOpened}
            menuList={mobileList}
            logoutUserEvent={logoutUserEvent}
            user={user}
          />
        )}
      </>
    );
  };

  return isMobile ? <MobileNavBar /> : <DesktopNavBar />;
};

export default NavBar;
