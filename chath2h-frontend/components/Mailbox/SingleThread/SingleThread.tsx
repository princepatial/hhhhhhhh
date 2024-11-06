import openArrowImg from '@images/open_arrow.svg';
import logo from '@landingPageImages/H2H_logo.png';
import axios from 'axios';
import classNames from 'classnames';
import AvatarWithStatus from 'components/AvatarWithStatus';
import dayjs from 'dayjs';
import { useGlobalState } from 'globalState';
import { Conversation, NewChatInvitationType, Recipient, Selected } from 'globalTypes';
import { welcomeMessageData } from 'helpers';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ConversationTile from '../ConversationTile';
import styles from './SingleThread.module.scss';

type Props = {
  isWelcomeMessage?: boolean;
  conversations?: Conversation[] | NewChatInvitationType[];
  children?: string | JSX.Element | JSX.Element[];
  selectedConversation?: string;
  recipient?: Recipient;
  onSelect: (data: Selected) => void;
  isShortcut?: boolean;
};

type PropsWelcome = {
  onSelect: () => Promise<void>;
  isWelcomeMessageRead: boolean | null;
};

const SingleWelcomeThread = ({ onSelect, isWelcomeMessageRead }: PropsWelcome) => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <div className={classNames(styles.thread)} onClick={onSelect}>
        <Image src={logo} width={56} height={56} alt="welcome image" />
        <div className={styles.middleCol}>
          <span className={styles.user}>
            {t('SingleThread_welcome')}
            {isWelcomeMessageRead !== null && !isWelcomeMessageRead && (
              <span className={styles.notViewed}>(1)</span>
            )}
          </span>
        </div>
      </div>
      <div className={styles.line} />
    </div>
  );
};

const SingleThread = ({
  isWelcomeMessage = false,
  children,
  selectedConversation,
  conversations = [],
  recipient,
  onSelect,
  isShortcut
}: Props) => {
  const [showConversations, setShowConversations] = useState(false);
  const [isWelcomeMessageRead, setIsWelcomeMessageRead] = useGlobalState('isWelcomeMessageRead');
  const [notViewedCount, setNotViewedCount] = useState(0);
  const { t } = useTranslation('common');
  const isNewInvitation = !!children;

  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const isThisConversation = conversations.findIndex(
        (item) => 'id' in item && (item as Conversation).id === selectedConversation
      );
      if (isThisConversation !== -1) {
        setShowConversations(true);
      }
    }
  }, [conversations, selectedConversation]);

  useEffect(() => {
    const notViewedMessagesSum = (conversations as any[]).reduce(
      (acc: number, next: Conversation | NewChatInvitationType) =>
        acc + (('messagesNotViewed' in next ? next.messagesNotViewed : 1) || 0),
      0
    );
    setNotViewedCount(notViewedMessagesSum);
  }, [conversations]);

  const date = useMemo(
    () =>
      !!conversations &&
      dayjs(conversations[0]?.updatedAt || conversations[0]?.createdAt).format('DD.MM.YYYY'),
    [conversations.length]
  );

  const offer = conversations && (conversations[0]?.need || conversations[0]?.coachOffer);
  const { filename } = recipient?.avatar || {};
  const imageSrc = filename && useImageUrl(filename);

  const resetUnreadMessages = async (conversationId: string) => {
    try {
      await axios.patch(`/mailbox/viewed/${conversationId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleThreadConversations = () => {
    setShowConversations(!showConversations);
  };

  const onSelectThread = async (conversation: Conversation) => {
    onSelect({
      conversation,
      recipient
    });
    await resetUnreadMessages(conversation.id);
  };

  const onSelectWelcomeThread = async () => {
    onSelect(welcomeMessageData);
  };

  const changeOnSelectThread = () => 'id' in conversations[0] && onSelectThread(conversations?.[0]);

  const onClickThread = () =>
    conversations.length ? toggleThreadConversations() : changeOnSelectThread();

  return isWelcomeMessage ? (
    <SingleWelcomeThread
      onSelect={onSelectWelcomeThread}
      isWelcomeMessageRead={isWelcomeMessageRead}
    />
  ) : (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.thread,
          isNewInvitation && styles.treadNewInvitation,
          !conversations.length &&
            'id' in conversations[0] &&
            selectedConversation === conversations?.[0].id &&
            styles.selected
        )}
        onClick={onClickThread}>
        {imageSrc && <AvatarWithStatus imageSrc={imageSrc} userId={recipient?.id} />}
        <div className={styles.middleCol}>
          <span className={styles.user}>
            {recipient?.firstName}
            {!!notViewedCount && <span className={styles.notViewed}>({notViewedCount})</span>}
          </span>
          {conversations.length && !isNewInvitation ? (
            <span className={styles.greyText}>
              {conversations.length} {t('SingleThread_conversations')}
            </span>
          ) : null}
          {isNewInvitation ? <span>{offer?.problemTitle}</span> : null}
          {!conversations.length ? (
            <span className={styles.greyText}>{t('SingleThread_no_conversations')}</span>
          ) : null}
          {children}
        </div>
        {conversations.length ? (
            !isShortcut && <Image
            src={openArrowImg}
            alt="open thread conversations"
            className={classNames(styles.openArrow, !showConversations && styles.openThreadArrow)}
        />
        ) : (
          <span className={classNames(styles.date, isNewInvitation && styles.dateNewInvitation)}>
            {date}
          </span>
        )}
      </div>
      <div className={styles.line} />

      {!children &&
        showConversations &&
        conversations.length &&
        conversations.map((conversation) => {
          if (!('id' in conversation)) return;
          const needOffer =
            'coachOffer' in conversation ? conversation.coachOffer : conversation.need;
          return (
            <div key={conversation.id} onClick={() => onSelectThread(conversation)}>
              {!!needOffer && (
                <ConversationTile
                  isMessagesNotViewed={!!conversation.messagesNotViewed}
                  isNeed={'need' in conversation}
                  text={needOffer.problemTitle}
                  isSelected={selectedConversation === conversation.id}
                />
              )}
              <div className={styles.line} />
            </div>
          );
        })}
    </div>
  );
};

export default SingleThread;
