import { useTranslation } from 'next-i18next';
import styles from './ChatHistory.module.scss';
import SingleMessage from '@components/Mailbox/SingleMessage';
import { useSingleNeedOfferConversation } from 'queries/singleNeedOfferQuery';
import { useGlobalState } from 'globalState';
import useImageUrl from 'hooks/getImageUrl';

type Props = {
  needOfferId: string;
  activeConversation: { id: string; date: string };
  isNeed: boolean;
};

const ChatHistory = ({ activeConversation, needOfferId, isNeed }: Props) => {
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const { id, date } = activeConversation;
  const { data, error } = useSingleNeedOfferConversation(needOfferId, id);

  return (
    <>
      <div className={styles.chatEnd}>
        <div className={styles.text}>{`${t('SinglePage_chat_ended')} ${date}r`}</div>
      </div>
      <div className={styles.messageList}>
        {data &&
          user &&
          data.map((item) => {
            const { from, to } = item;
            if (typeof from === 'string' || typeof to === 'string') return;
            const coachIdOffer = from._id === user._id ? to._id : '';

            return (
              <SingleMessage
                message={item}
                avatar={useImageUrl(from.avatar.filename)}
                userId={user._id}
                coachId={isNeed ? coachIdOffer : user._id}
                key={item._id}
              />
            );
          })}
      </div>
    </>
  );
};

export default ChatHistory;
