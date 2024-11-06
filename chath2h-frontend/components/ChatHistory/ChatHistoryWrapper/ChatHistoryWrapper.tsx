import classNames from 'classnames';
import styles from './ChatHistoryWrapper.module.scss';
import Image from 'next/image';
import chatBackgroundImg from '@images/chat-background.png';
import arrowBack from '@images/arrow_green.svg';
import { useTranslation } from 'next-i18next';
import { StateSetterType } from 'globalTypes';

type Props = {
  children: string | JSX.Element | JSX.Element[];
  isActiveChat: boolean;
  setIsActiveChat: StateSetterType<boolean>;
  title?: string;
  isNeed?: boolean;
};

const ChatHistoryWrapper = ({ children, isActiveChat, setIsActiveChat, title, isNeed }: Props) => {
  const { t } = useTranslation('common');

  return (
    <div
      className={classNames(
        styles.chat,
        isActiveChat && styles.chatActive,
        title ? styles.chatDesktopMailbox : styles.chatDesktop
      )}>
      <Image
        src={chatBackgroundImg}
        alt="chat background"
        className={styles.backgroundImg}
        draggable={false}
      />
      <div
        onClick={() => setIsActiveChat(false)}
        className={classNames(
          styles.backToList,
          title ? styles.backToListDesktopMailbox : styles.backToListDesktop
        )}>
        <Image src={arrowBack} width={16} height={16} className={styles.arrow} alt="arrowBack" />
        <span>{t('SinglePage_chat_back_messages')}</span>
      </div>
      {title && (
        <div className={styles.box}>
          <div className={styles.title}>
            <span className={isNeed ? styles.need : styles.offer}>
              {isNeed ? t('ThreadConversation_need_title') : t('ThreadConversation_offer_title')}
            </span>
            <span className={styles.title}>{title}</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default ChatHistoryWrapper;
