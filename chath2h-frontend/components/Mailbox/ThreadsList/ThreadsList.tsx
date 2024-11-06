import NewChatInvitation from '@components/Mailbox/NewChatInvitation';
import classNames from 'classnames';
import {
  InteractionRecipientOffers,
  Selected,
  StateSetterType,
  Thread,
  userIdNeedId
} from 'globalTypes';
import { useTranslation } from 'next-i18next';
import ChatList from '../ChatsList';
import SingleThread from '../SingleThread';
import styles from './ThreadsList.module.scss';

type Props = {
  isVisible: boolean;
  threads: Thread[];
  chats: InteractionRecipientOffers[] | null;
  selectedConversation?: string;
  onSelectConversation: (data: Selected) => void;
  newInvitationRequest: boolean | null;
  setIsMailboxOpen: StateSetterType<boolean>;
  isMailboxOpen: boolean;
  setCurrentNeedOffer: StateSetterType<userIdNeedId | null>;
  currentNeedOffer: userIdNeedId | null;
  setIsActiveChat: StateSetterType<boolean>;
  setSendMessageId: StateSetterType<string | null>;
};

const ThreadsList = ({
  isVisible,
  threads,
  selectedConversation,
  onSelectConversation,
  newInvitationRequest,
  setIsMailboxOpen,
  isMailboxOpen,
  chats,
  setCurrentNeedOffer,
  currentNeedOffer,
  setIsActiveChat,
  setSendMessageId
}: Props) => {
  return (
    <div className={classNames(styles.container, !isVisible && styles.isHidden)}>
      <div className={styles.menu}>
        <div
          className={classNames(isMailboxOpen && styles.active)}
          onClick={() => setIsMailboxOpen(true)}>
          Mailbox
        </div>
        <div
          className={classNames(!isMailboxOpen && styles.active)}
          onClick={() => setIsMailboxOpen(false)}>
          Chats
        </div>
      </div>
      <NewChatInvitation
        newInvitationRequest={newInvitationRequest}
        setSendMessageId={setSendMessageId}
      />
      {isMailboxOpen ? (
        <>
          {threads.length > 0 &&
            threads?.map((thread) => {
              const { recipient, conversations } = thread;
              return (
                <SingleThread
                  key={recipient.id}
                  conversations={conversations}
                  recipient={recipient}
                  selectedConversation={selectedConversation}
                  onSelect={onSelectConversation}
                />
              );
            })}
          <SingleThread
            isWelcomeMessage
            selectedConversation={selectedConversation}
            onSelect={onSelectConversation}
          />
        </>
      ) : chats && chats.length > 0 ? (
        chats.map((chat) => {
          return (
            <ChatList
              recipient={chat.interactionRecipient}
              setCurrentNeedOffer={setCurrentNeedOffer}
              currentNeedOffer={currentNeedOffer}
              needOffer={chat.needOffers}
              setIsActiveChat={setIsActiveChat}
            />
          );
        })
      ) : (
        <Empty isMailbox={false} />
      )}
    </div>
  );
};

const Empty = ({ isMailbox = true }: { isMailbox?: boolean }) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.noData}>
      {t(`${isMailbox ? 'ThreadList_mailbox_empty' : 'ThreadList_chats_empty'}`)}
    </div>
  );
};
export default ThreadsList;
