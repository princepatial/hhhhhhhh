import AvatarWithStatus from '@components/AvatarWithStatus';
import { CircleIArrowRightIconComponent } from '@components/icons';
import colorScheme from '@helpers/color-scheme';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styles from './Chat.module.scss';
import Timer from '@components/Mailbox/Timer';
import { useChatDetails } from 'queries/chatRequestQuery';
import useImageUrl from 'hooks/getImageUrl';
import Button from '@components/Button';
import { GetMessage, StateSetterType, View } from 'globalTypes';
import router from 'next/router';
import { onSendMessage } from 'hooks/sendMessage';
import { useLoadingTrackerForList } from 'hooks/useLoadingTracker';
import SingleMessage from '@components/Mailbox/SingleMessage';
import classNames from 'classnames';
import { socket } from 'socket';
import { useSocket } from 'hooks/useSocket';
import { useScrollChat } from 'hooks/useScrollChat';
import { validateMessage } from 'helpers';
import TextAreaChat from '@components/TextAreaChat';

type Props = {
  id?: string | string[];
  setView: StateSetterType<View>;
  view: View;
  interactionId?: string | null;
  userId?: string;
};

const Chat = ({ id, setView, view, interactionId, userId }: Props) => {
  const { t } = useTranslation('common');
  const { loadingData, ltrack } = useLoadingTrackerForList();
  const { data: chatDetails, refetch: refetchDetails, isRefetching } = useChatDetails(id);

  useEffect(() => {
    if ((view = View.WAITING)) {
      refetchDetails();
    }
  }, [view]);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const refScrollTo = useRef<null | HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Array<GetMessage>>([]);
  const [isMeMessaging, setIsMeMessaging] = useState(false);
  const [isTimerTicking, setIsTimerTicking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesSliced = useScrollChat({
    scrollRef,
    refScrollTo,
    isMeMessaging,
    messages
  });

  const handleChangeMessage = (value: string) => {
    setNewMessage(value);
  };

  const handleMessageSend = ltrack('sendMessage', async () => {
    if (
      !interactionId ||
      !userId ||
      !newMessage ||
      loadingData.sendMessage ||
      newMessage.trim().length < 1
    )
      return;
    const isValidate = validateMessage(newMessage);
    if (!isValidate) {
      setErrorMessage(t('Chat_not_validate_send_message'));
      return;
    } else {
      setErrorMessage(null);
    }

    const message = {
      to: userId === chatDetails?.coach._id ? chatDetails?.user._id : chatDetails?.coach._id,
      interactionId,
      content: newMessage,
      from: userId
    };
    socket.emit('sendMessage', (socket.io, message));
    setIsMeMessaging(true);
    setNewMessage('');
    setMessages((prevState) => [...prevState, message]);
  });

  const onTimeEnd = () => {
    setIsTimerTicking(false);
    setView(View.NOT_RESPONDING);
  };

  const notRespondingEvent = ltrack('notResponding', async () => {
    if (!userId || loadingData.notResponding) return;
    const message = await onSendMessage(chatDetails, t, userId);
    const query = {
      conversationId: message.existingConversationId
    };
    router.push({
      pathname: '/mailbox',
      query
    });
  });

  const socketOnMessageRequest = (socketResponse: GetMessage) => {
    if (interactionId) {
      const message = {
        to: socketResponse.to,
        interactionId,
        content: socketResponse.content,
        from: socketResponse.from
      };
      setIsMeMessaging(false);
      setMessages((prevState) => [...prevState, message]);
    }
  };

  useSocket('MessageRequest', (socketResponse) => socketOnMessageRequest(socketResponse));

  if (!chatDetails) return;

  const initiator = chatDetails?.initiator === chatDetails?.coach._id ? 'coach' : 'user';

  const userAvatar = useImageUrl(chatDetails.user.avatar.filename);
  const coachAvatar = useImageUrl(
    chatDetails.coach.coachProfile?.coachPhoto?.filename || chatDetails.coach.avatar.filename
  );

  const waitingScreenImage = initiator === 'coach' ? userAvatar : coachAvatar;

  const waitingID = initiator === 'coach' ? chatDetails.user._id : chatDetails.coach._id;
  const waitingName =
    initiator === 'coach' ? chatDetails.user.firstName : chatDetails.coach.firstName;
  return (
    <div className={styles.container}>
      <div
        className={classNames(
          styles.conversation,
          View.CONVERSATION === view && styles.conversationChat
        )}>
        {View.WAITING === view && (
          <>
            {!!chatDetails && !isRefetching && (
              <Timer
                isTicking={isTimerTicking}
                time={chatDetails.updatedAt}
                onTimeEnd={onTimeEnd}
              />
            )}
            <span className={styles.waiting}>{t('Chat_waiting_for')}</span>
            <div className={styles.user}>
              <AvatarWithStatus imageSrc={waitingScreenImage} userId={waitingID} />
              <span>{waitingName}</span>
            </div>
          </>
        )}
        {View.NOT_RESPONDING === view && (
          <>
            <Timer isTicking={false} />
            <span className={styles.waiting}>
              {waitingName}
              {t('Chat_not_responding')}
            </span>
            <div className={styles.user}>
              <AvatarWithStatus imageSrc={waitingScreenImage} userId={waitingID} />
              <span>{waitingName}</span>
            </div>
            <div className={styles.buttons}>
              <Button
                onClick={() => router.push('/dashboard')}
                text={t('Chat_cancel_chat')}
                buttonColor="whiteGreen"
              />
              <Button
                disabled={loadingData.notResponding}
                onClick={notRespondingEvent}
                text={t('Chat_send_message')}
              />
            </div>
          </>
        )}
        {View.CONVERSATION === view && (
          <div className={styles.messages} ref={scrollRef}>
            {messagesSliced.map((item: GetMessage, index) => (
              <SingleMessage
                key={index}
                message={item}
                avatar={chatDetails?.coach._id !== item.from ? userAvatar : coachAvatar}
                userId={userId || ''}
                coachId={chatDetails?.coach._id}
              />
            ))}
            <div ref={refScrollTo}></div>
          </div>
        )}
      </div>
      {View.CONVERSATION === view && (
        <div className={styles.footer}>
          <div className={styles.line} />
          <div className={styles.textAreaWrapper}>
            <div className={styles.field}>
              <TextAreaChat
                limit={1000}
                messageText={newMessage}
                onChange={(e) => handleChangeMessage(e.target.value)}
                onEnterClicked={handleMessageSend}
                placeHolder={t('ThreadConversation_write_here')}
                style={styles.textarea}
              />
              {errorMessage && <span className={styles.error}>{errorMessage}</span>}
            </div>
            <button
              onClick={handleMessageSend}
              className={styles.sendButton}
              disabled={view !== View.CONVERSATION || loadingData.sendMessage || !newMessage}>
              <CircleIArrowRightIconComponent
                color={view !== View.CONVERSATION ? colorScheme.grey : undefined}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Chat;
