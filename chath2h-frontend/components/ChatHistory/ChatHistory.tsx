import { useTranslation } from 'next-i18next';
import styles from './ChatHistory.module.scss';
import SingleMessage from '@components/Mailbox/SingleMessage';
import { useSingleNeedOfferConversation } from 'queries/singleNeedOfferQuery';
import { useGlobalState } from 'globalState';
import useImageUrl from 'hooks/getImageUrl';
import { useEffect, useRef } from 'react';

type Props = {
  needOfferId: string;
  activeConversation: { id: string; date?: string };
  isScrollBottomOnStart?: boolean;
};

const ChatHistory = ({ activeConversation, needOfferId, isScrollBottomOnStart = false }: Props) => {
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const { data } = useSingleNeedOfferConversation(needOfferId, activeConversation.id);

  const scrollRef = useRef<null | HTMLDivElement>(null);
  const refScrollTo = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current || !refScrollTo.current || !isScrollBottomOnStart) return;
    scrollRef.current.scrollTo({ top: refScrollTo.current.offsetTop });
  }, [isScrollBottomOnStart, refScrollTo, scrollRef, data]);

  return (
    <>
      {activeConversation?.date && (
        <div className={styles.chatEnd}>
          <div className={styles.text}>{`${t('SinglePage_chat_ended')} ${
            activeConversation.date
          }`}</div>
        </div>
      )}
      <div className={styles.messageList} ref={scrollRef}>
        {data && user && data.length > 0 ? (
          data.map((item) => {
            const { from, to } = item;
            if (typeof from === 'string' || typeof to === 'string') return;
            const coachIdOffer = from._id === user._id ? to._id : '';

            return (
              <SingleMessage
                message={item}
                avatar={useImageUrl(from.avatar.filename)}
                userId={user._id}
                coachId={'image' in item ? coachIdOffer : user._id}
                key={item._id}
              />
            );
          })
        ) : (
          <div className={styles.chatListEmpty}>{t('ChatHistory_no_messages')}</div>
        )}
        <div ref={refScrollTo}></div>
      </div>
    </>
  );
};

export default ChatHistory;
