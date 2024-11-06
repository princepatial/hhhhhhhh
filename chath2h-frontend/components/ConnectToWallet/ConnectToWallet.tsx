import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './ConnectToWallet.module.scss';
import { useTranslation } from 'next-i18next';

type Props = { style: string; isMobile?: boolean };

const ConnectToWallet = ({ style, isMobile }: Props) => {
  const { t } = useTranslation('common');

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');
        const classNameWallet = isMobile ? styles.mobileWallet : styles.walletButton;

        if (!connected || chain.unsupported || account) {
          const isChainUnSupported = chain && chain.unsupported ? openChainModal : openAccountModal;
          const onClickFunction = !connected ? openConnectModal : isChainUnSupported;
          return (
            <div className={style}>
              <button className={classNameWallet} onClick={onClickFunction} type="button">
                {!connected && <span>{t('Connect_wallet')}</span>}
                {chain && chain.unsupported && <span>{t('Wrong_network')}</span>}
                {account && account.displayName}
              </button>
            </div>
          );
        }
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectToWallet;
