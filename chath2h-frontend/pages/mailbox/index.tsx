import ChatHistory from '@components/ChatHistory';
import ChatHistoryWrapper from '@components/ChatHistory/ChatHistoryWrapper';
import ThreadsList from '@components/Mailbox/ThreadsList';
import WelcomeMessage from '@components/WelcomeMessage';
import axios from 'axios';
import classNames from 'classnames';
import ThreadConversation from 'components/Mailbox/ThreadConversation';
import { useGlobalState } from 'globalState';
import { ConversationType, Selected, userIdNeedId } from 'globalTypes';
import { findOverallLatestConversationWithRecipient, welcomeMessageData } from 'helpers';
import { useSocket } from 'hooks/useSocket';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useThreads } from 'queries/messagesQuery';
import { useSingleNeedOfferChats } from 'queries/singleNeedOfferQuery';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import styles from './mailbox.module.scss';

enum currentPage {
  THREADS = 'threads',
  CONVERSATION = 'conversation'
}

const Mailbox = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const conversationId = router.query.conversationId;
  const [user] = useGlobalState('user');
  const { data: threads, refetch: refetchThreads, isFetched: isFetchedThreads } = useThreads();
  const { data: chats } = useSingleNeedOfferChats();
  const [newInvitationRequest, setNewInvitationRequest] = useState(null);
  const [isMailboxOpen, setIsMailboxOpen] = useState(true);
  const [currentNeedOffer, setCurrentNeedOffer] = useState<userIdNeedId | null>(null);
  const [isActiveChat, setIsActiveChat] = useState(false);
  const [sendMessageId, setSendMessageId] = useState<string | null>(null);
  const [helperMessageCounter, setHelperMessageCounter] = useState<number>(0);
  const [isWelcomeMessageRead, setIsWelcomeMessageRead] = useGlobalState('isWelcomeMessageRead');

  const resetUnreadMessages = async (conversationId: string) => {
    try {
      await axios.patch(`/mailbox/viewed/${conversationId}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (conversationId === ConversationType.WELCOME_MSG) {
      setIsWelcomeMessageRead(true);
      !isWelcomeMessageRead && resetUnreadWelcomeMessage();
    }
  }, [conversationId, isWelcomeMessageRead]);

  useEffect(() => {
    if (conversationId) {
      resetUnreadMessages(conversationId as string);
    }
  }, [conversationId]);

  const activeConversation = useMemo(() => {
    const newThread = threads.map(({ conversations, recipient }) => {
      const isConv = conversations.find((conversation) => conversation.id === conversationId);
      return isConv ? { conversation: isConv, recipient } : null;
    });
    return newThread.filter((item) => item)[0];
  }, [threads, conversationId]);

  useLayoutEffect(() => {
    if (user) {
      const isDisabled = user.isDisabled;
      if (isDisabled) {
        router.replace('/');
      }
    }
  }, [user]);

  const selectedFromUrl = useMemo(() => {
    if (activeConversation) {
      const data: Selected = {
        conversation: activeConversation.conversation,
        recipient: {
          avatar: activeConversation.recipient.avatar,
          id: activeConversation.recipient.id,
          firstName: activeConversation.recipient.firstName,
          coachProfile: activeConversation.recipient?.coachProfile
        }
      };
      return data;
    }
    return null;
  }, [user, activeConversation]);

  const [isFirstTime, setIsFirstTime] = useState(true);
  const [selected, setSelected] = useState<Selected | null>(selectedFromUrl);
  const [currentMobilePage, setCurrentMobilePage] = useState<currentPage>(currentPage.THREADS);

  useSocket('ConversationRequest', () => refetchThreads());
  useSocket('InteractionInvitationRequest', (socketResponse) => {
    setNewInvitationRequest(socketResponse.interactionRequestId);
    refetchThreads();
  });

  useEffect(() => {
    if (selectedFromUrl) {
      setSelected(selectedFromUrl);
      setIsFirstTime(false);
    }
  }, [selectedFromUrl, isFirstTime]);

  useEffect(() => {
    if ((!threads.length && isFetchedThreads) || conversationId === ConversationType.WELCOME_MSG)
      setSelected(welcomeMessageData);
  }, [conversationId, threads.length, isFetchedThreads]);

  useEffect(() => {
    if (conversationId || !threads) {
      return;
    }

    const lastConversation = findOverallLatestConversationWithRecipient(threads);

    if (lastConversation) {
      setSelected(lastConversation);
    }
  }, [conversationId, threads]);

  const selectedConversation =
    typeof selected?.conversation === 'string'
      ? selected?.conversation
      : selected?.conversation?.id;

  useEffect(() => {
    if (selectedConversation) {
      router.replace({ query: 'conversationId=' + selectedConversation });
      setCurrentMobilePage(currentPage.CONVERSATION);
    }
  }, [selected?.conversation]);

  useEffect(() => {
    const foundThreadWithRecipient = threads
      .map((thread) => {
        const conversation = thread.conversations.find((c) => {
          return c.id === sendMessageId;
        });

        if (conversation) {
          return {
            conversation,
            recipient: thread.recipient
          };
        }
        return null;
      })
      .find((item) => item !== null);
    if (foundThreadWithRecipient) {
      setSelected(foundThreadWithRecipient);
    }
  }, [sendMessageId]);

  const onSelectConversation = (data: Selected) => {
    setSelected(data);
    refetchThreads();
  };

  const onDeleteConversation = () => {
    refetchThreads();
    setSelected(null);
  };

  const onBackToMessages = () => {
    setCurrentMobilePage(currentPage.THREADS);
    setSelected(null);
  };

  const resetUnreadWelcomeMessage = async () => {
    try {
      await axios.patch('/users/read-welcome-message');
      setIsWelcomeMessageRead(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <ThreadsList
        chats={chats}
        newInvitationRequest={newInvitationRequest}
        threads={threads}
        selectedConversation={selectedConversation}
        onSelectConversation={onSelectConversation}
        isVisible={currentMobilePage === currentPage.THREADS}
        isMailboxOpen={isMailboxOpen}
        setIsMailboxOpen={setIsMailboxOpen}
        setCurrentNeedOffer={setCurrentNeedOffer}
        currentNeedOffer={currentNeedOffer}
        setIsActiveChat={setIsActiveChat}
        setSendMessageId={setSendMessageId}
      />
      {isMailboxOpen && typeof selected?.conversation !== 'string' && (
        <ThreadConversation
          conversation={selected?.conversation}
          recipient={selected?.recipient}
          backToMessages={onBackToMessages}
          onDeleteConversation={onDeleteConversation}
          isVisible={currentMobilePage === currentPage.CONVERSATION}
          helperMessageCounter={helperMessageCounter}
          setHelperMessageCounter={setHelperMessageCounter}
        />
      )}

      {isMailboxOpen && selected?.conversation === ConversationType.WELCOME_MSG && (
        <div className={styles.welcomeMsgWrapper}>
          <div
            className={classNames(
              styles.welcomeMsg,
              currentMobilePage !== currentPage.CONVERSATION && styles.isHidden
            )}>
            <WelcomeMessage backToMessages={onBackToMessages} />
          </div>
        </div>
      )}

      {!isMailboxOpen && (
        <ChatHistoryWrapper
          isActiveChat={isActiveChat}
          setIsActiveChat={setIsActiveChat}
          title={currentNeedOffer?.title}
          isNeed={currentNeedOffer?.isNeed}>
          <>
            {currentNeedOffer && (
              <ChatHistory
                isScrollBottomOnStart
                activeConversation={currentNeedOffer}
                needOfferId={currentNeedOffer.idNeed}
              />
            )}
          </>
        </ChatHistoryWrapper>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Mailbox;
