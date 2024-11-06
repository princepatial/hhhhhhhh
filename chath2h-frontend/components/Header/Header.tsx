import ConnectToWallet from '@components/ConnectToWallet';
import Dialog from '@components/Dialog';
import WelcomeMessage from '@components/WelcomeMessage';
import ChevronRightIconComponent from '@components/icons/chevron-right/chevron-right-icon.component';
import MessagesComponent from '@components/messages';
import colorScheme from '@helpers/color-scheme';
import blackArrow from '@images/black_arrow.svg';
import whiteArrow from '@images/white_arrow.svg';
import logo from '@landingPageImages/H2H_logo.png';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import classNames from 'classnames';
import Button from 'components/Button';
import { setGlobalState, useGlobalState } from 'globalState';
import { Language, User } from 'globalTypes';
import { languageOptions } from 'helpers';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { logoutUser } from 'queries/authorizationQuery/authorization';
import { FC, useEffect, useState } from 'react';
import SelectComponent, { DropdownIndicatorProps, SingleValue, components } from 'react-select';
import { socket } from 'socket';
import styles from './Header.module.scss';
import { NavBar } from './blocks';
import {useDisconnect} from "wagmi";

type IsMulti = false;

type UserHeaderDataProps = {
  user: User;
  avatar: string;
  styles: {
    readonly [key: string]: string;
  };
  logoutUserEvent: () => void;
};

const UserHeaderData: FC<UserHeaderDataProps> = ({ user, avatar, styles, logoutUserEvent }) => {
  const [tokens, setTokens] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('common');
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (openConnectModal && user.walletAddress) {
      openConnectModal();
    }

    socket.on('UserBalanceRequest', (e) => setTokens(e.balances[user._id]));

    return () => {
      socket.off('UserBalanceRequest');
    };
  }, []);

  const desktopMenu = [
    {
      link: '/dashboard/my-profile',
      text: 'Header_settings'
    },
    {
      link: '/help',
      text: 'Header_help_centre'
    },
    {
      link: '/mission',
      text: 'Header_mission'
    }
  ];
  return (
    <>
      <Link href="/dashboard/my-tokens" className={styles.tokenAmount}>
        <span>{(tokens || user?.tokens)?.toFixed()} H2H</span>
      </Link>
      <ConnectToWallet style={styles.wallet} />
      {avatar ? (
        <div className={styles.profileMenu}>
          <div
            onClick={() => setIsMenuOpen((prevState) => !prevState)}
            className={styles.menuWrapper}>
            <Image
              className={styles.avatar}
              src={avatar}
              alt="avatar"
              width={39}
              height={39}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.arrow}>
              <ChevronRightIconComponent direction="top" color="#39aba4" />
            </div>

            {isMenuOpen && (
              <>
                <div className={styles.background}></div>
                <div className={styles.menu}>
                  {desktopMenu.map((menuItem, index) => {
                    const { text, link } = menuItem;
                    return (
                      <Link key={index} href={link} className={styles.item}>
                        {t(text)}
                      </Link>
                    );
                  })}
                  <button className={styles.item} onClick={logoutUserEvent}>
                    {t('Header_logout')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

const Header: FC = () => {
  const { disconnect } = useDisconnect()
  const [language, setLanguage] = useGlobalState('language');
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const [missionRef] = useGlobalState('missionRef');
  const [unreadMessagesCount] = useGlobalState('unreadMessagesCount');
  const [isWelcomeMessageRead] = useGlobalState('isWelcomeMessageRead');
  const [isAuthPage, setIsAuthPage] = useState(true);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hideEnvelope, setHideEnvelope] = useState(true);
  const router = useRouter();
  const avatar = user && useImageUrl(user?.avatar.filename);

  useEffect(() => {
    setIsHomePage(router.pathname === '/');
    setIsAuthPage(
      router.pathname.includes('/authorization') || router.pathname.includes('/register')
    );
  }, [router.pathname]);

  useEffect(() => {
    setHideEnvelope(!!localStorage.getItem('H2H_hide_wirkommen_message'));
  }, []);

  const handleSelectLanguage = (newValue: SingleValue<Language>) => {
    if (newValue) {
      setLanguage(newValue);
      router.replace(router.asPath, router.asPath, { locale: newValue.value });
    }
  };

  const DropdownIndicator = (props: DropdownIndicatorProps<Language, IsMulti>) => {
    return (
      <components.DropdownIndicator {...props}>
        <Image src={isHomePage ? whiteArrow : blackArrow} alt={'dropdown-indicator'}></Image>
      </components.DropdownIndicator>
    );
  };

  const onLoginClick = () => {
    router.push('/authorization');
  };

  const goToNextSlide = () => {
    setIsPopupOpen(false);
    missionRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onInBoxClick = () => {
    if (!isHomePage && user) {
      router.push('/mailbox');
    } else {
      localStorage.setItem('H2H_hide_wirkommen_message', 'true');
      setHideEnvelope(true);
      setIsPopupOpen(true);
    }
  };

  const logoutUserEvent = () => {
    logoutUser();
    setGlobalState('user', null);
    socket.emit('setStatus', 'Offline');
    disconnect();
    router.replace('/');
  };

  const unreadMessagesSum = isWelcomeMessageRead ? unreadMessagesCount : unreadMessagesCount + 1;

  return (
    <nav className={styles.container}>
      <Dialog isOpen={isPopupOpen} handleClose={() => setIsPopupOpen(false)}>
        <div className={styles.dialog}>
          <WelcomeMessage />
          <Button text={t('Landing_page_popup_button')} onClick={goToNextSlide} />
        </div>
      </Dialog>
      <div className={classNames(styles.header, !isAuthPage && !isHomePage && styles.headerWhite)}>
        <Link href="/">
          <Image className={styles.logo} src={logo} alt={'H2H header logo'} />
        </Link>
        <div className={styles.header_inner}>
          <div className={classNames(styles.menu, styles.header_desktop_element)}>
            <NavBar isHomePage={isHomePage} isAuthPage={isAuthPage} />
          </div>
          {((isHomePage && !hideEnvelope) || (!isHomePage && user)) && (
            <MessagesComponent
              color={isHomePage ? colorScheme.white : colorScheme.black}
              onClick={() => onInBoxClick()}
              floating={isHomePage}
              messageCount={isHomePage ? 1 : unreadMessagesSum}
            />
          )}
          {user && avatar && router.asPath !== '/' ? (
            <UserHeaderData
              user={user}
              avatar={avatar}
              styles={styles}
              logoutUserEvent={() => logoutUserEvent()}
            />
          ) : null}
          {!user && !isAuthPage ? (
            <Button text="Login" onClick={onLoginClick} buttonColor="green" />
          ) : null}
          <div className={classNames(styles.language, styles.header_desktop_element)}>
            <SelectComponent
              aria-labelledby="language"
              value={language}
              onChange={handleSelectLanguage}
              components={{ DropdownIndicator }}
              options={languageOptions}
              className="languageSelect"
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  width: '60px',
                  height: '40px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  borderColor: 'transparent',
                  cursor: 'pointer'
                }),
                valueContainer: (baseStyles) => ({
                  ...baseStyles,
                  padding: 0
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: isHomePage ? '#F9F9F9' : '#141414',
                  fontWeight: 500,
                  fontSize: '16px'
                }),
                indicatorSeparator: () => ({
                  display: 'none'
                }),
                indicatorsContainer: () => ({
                  padding: 0
                })
              }}
            />
          </div>
          <div className={styles.header_mobile_element}>
            <NavBar
              isHomePage={isHomePage}
              isAuthPage={isAuthPage}
              isMobile={true}
              user={user || undefined}
              logoutUserEvent={logoutUserEvent}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
