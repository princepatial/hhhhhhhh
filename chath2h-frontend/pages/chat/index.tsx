import Chat from '@components/Chat';
import Details from '@components/NeedsAndOffer/Details';
import chatBackgroundImg from '@images/chat-background.png';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useNeedDetails } from 'queries/needQuery';
import { useOffer } from 'queries/offerQuery';
import styles from './chat.module.scss';
import { useTranslation } from 'next-i18next';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ConversationContext, DialogStep, NewMessage, View } from 'globalTypes';
import { socket } from 'socket';
import { useGlobalState } from 'globalState';
import Timer from '@components/Mailbox/Timer';
import { useRouter } from 'next/router';
import Button from '@components/Button';
import { finishChat, saveChatDuration } from 'queries/chatQuery/chatQuery';
import { useLoadingTracker } from 'hooks/useLoadingTracker';
import OnEndChat from '@components/Popups/OnEndChat';
import { useSocket } from 'hooks/useSocket';
import { checkIfExitSite } from 'hooks/checkIfExitSite';
import { declineChatRequest } from 'queries/chatRequestQuery/chatRequest';
import PauseChat from '@components/Chat/PauseChat/PauseChat';
import { useChatInteraction } from 'queries/chatQuery';
import { ChevronRightIconComponent } from '@components/icons';
import AvatarWithStatus from '@components/AvatarWithStatus';
import useImageUrl from 'hooks/getImageUrl';
import classNames from 'classnames';

const minutesCounting = 25;

const ChatPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');
  const { isLoading, ltrack } = useLoadingTracker();

  const chatQuery = useGlobalState('chatQuery')[0];
  const userId = useGlobalState('user')[0]?._id;
  const [user] = useGlobalState('user');

  const [view, setView] = useState<View>(chatQuery?.startChat ? View.CONVERSATION : View.WAITING);
  const [interactionId, setInteractionId] = useState<null | string>(
    chatQuery?.interactionId || null
  );
  const [pauseButtonClicked, setIsPauseButtonClicked] = useState(false);

  const [isDogInView, setIsDogInView] = useState(false);
  const [chatCreateTime, setChatCreateTime] = useState<Date | null>(
    chatQuery?.interactionStartDate || null
  );

  const [pausedTimestamp, setPauseTimestamp] = useState<number>(0);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [chatTimerCounter, setChatTimerCounter] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatIsFinished, setChatIsFinished] = useState(false);
  const [isFinishButtonClicked, setIsFinishButtonClicked] = useState(false);
  const [step, setStep] = useState<DialogStep>(DialogStep.TIME_END);
  const [isTimerTicking, setIsTimerTicking] = useState(true);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [isDetailsMobileOpen, setIsDetailsMobileOpen] = useState(false);

  const { data: needDetails } = useNeedDetails(chatQuery?.need);
  const { data: offerDetails } = useOffer(chatQuery?.offer);
  const {
    data: { amount: chatFinishedTokenAmount, chatDuration: chatFinishedDuration },
    refetch
  } = useChatInteraction(interactionId!, step);

  const isNeed = !!chatQuery?.need;
  const data = isNeed ? needDetails : offerDetails;

  useLayoutEffect(() => {
    if (user) {
      const isDisabled = user.isDisabled;
      if (isDisabled) {
        router.replace('/');
      }
    }
  }, [user]);

  const messageSend = useMemo(() => {
    if (!data?._id || !data?.user?._id || !userId || !chatQuery?.userId || !chatQuery?.coachId)
      return;
    const newMessage: NewMessage = {
      from: userId,
      to: chatQuery?.userId == userId ? chatQuery.coachId : chatQuery.userId,
      content: 'NewChatInvitation_Send_Message_Content',
      conversationContext: isNeed ? ConversationContext.NEED : ConversationContext.COACH_OFFER,
      conversationContextId: data?._id,
      systemMessage: true
    };
    return newMessage;
  }, [data?._id, userId, data?.user?._id, chatQuery]);
  const isCoach = useMemo(() => chatQuery?.coachId === userId, [chatQuery?.coachId]);
  const router = useRouter();

  const finishFunctionCheckIfExit = async () => {
    if (view == View.WAITING) {
      chatQuery?.id && (await declineChatRequest(chatQuery.id));
    }

    if (view == View.CONVERSATION) {
      if (!interactionId || !userId) return;
      const initiator = userId;
      await finishChat(interactionId, initiator);
    }
  };

  checkIfExitSite({
    isBlockedSite: view === View.WAITING || (view === View.CONVERSATION && step !== DialogStep.END),
    message: messageSend,
    finishFunction: () => finishFunctionCheckIfExit()
  });

  const imageSrc = useImageUrl(
    data ? ('image' in data ? data.image.filename : data.representativePhoto.filename) : ''
  );

  const onInteractionStartedRequest = (socketRequest: any) => {
    setChatCreateTime(socketRequest.interactionStartDate);
    setPausedTime(0);
    setIsPauseButtonClicked(false);
    setView(View.CONVERSATION);
    setInteractionId(socketRequest.interactionId);
  };

  const socketOnEndChat = () => {
    setStep(DialogStep.END);
    setIsDialogOpen(true);
    setIsTimerTicking(false);
    setChatIsFinished(true);
  };

  useSocket('InteractionInitiatedRequest', (socketRequest) =>
    socket.emit('joinInteraction', (socket.io, socketRequest.interactionId))
  );
  useSocket('InteractionStartedRequest', (socketRequest) =>
    onInteractionStartedRequest(socketRequest)
  );
  useSocket('InteractionRequestDeclinedRequest', () => setView(View.NOT_RESPONDING));
  useSocket('InteractionFinishedRequest', socketOnEndChat);
  useSocket('InteractionClosedRequest', socketOnEndChat);

  const onTimeEnd = async () => {
    if (isCoach && interactionId && timerMinutes) {
      await saveChatDuration(interactionId, timerMinutes);
    }
    setChatTimerCounter((prevState) => prevState + 1);
    setIsFinishButtonClicked(false);
    setIsTimerTicking(false);
    setIsDialogOpen(true);
    socket.emit('preFinishInteraction', interactionId);
  };

  const onFinishChat = ltrack(async () => {
    if (isLoading) return;
    if (interactionId && timerMinutes) {
      saveChatDuration(interactionId, timerMinutes);
    }
    setIsFinishButtonClicked(true);
    setIsDialogOpen(true);
  });

  const onFinishChatShowSummary = async () => {
    if (!interactionId || !userId) return;
    try {
      await finishChat(interactionId, userId);
      setStep(DialogStep.END);
      setIsTimerTicking(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onPauseChat = async () => {
    setIsPauseButtonClicked(true);
    socket.emit('pauseInteraction', interactionId);
  };

  useEffect(() => {
    if (!chatQuery) {
      router.push('/');
    }
  }, [chatQuery, router]);

  useEffect(() => {
    setTimeout(() => {
      setIsDogInView(true);
    }, 1000 * 2);
  }, []);

  return (
    <div className={styles.container}>
      {view === View.CONVERSATION && (
        <PauseChat
          onFinishChatShowSummary={onFinishChatShowSummary}
          interactionId={interactionId}
          setIsTimerTicking={setIsTimerTicking}
          pauseButtonClicked={pauseButtonClicked}
          setIsPauseButtonClicked={setIsPauseButtonClicked}
          setIsFinishButtonClicked={setIsFinishButtonClicked}
          setPausedTime={setPausedTime}
          setPauseTimestamp={setPauseTimestamp}
          pauseTimestamp={pausedTimestamp}
        />
      )}
      {interactionId && data && userId && chatQuery && timerMinutes && (
        <OnEndChat
          onFinishChatShowSummary={onFinishChatShowSummary}
          chatFinishedDuration={chatFinishedDuration}
          chatFinishedTokenAmount={chatFinishedTokenAmount}
          interactionRequestId={chatQuery.id}
          setChatCreateTime={setChatCreateTime}
          setView={setView}
          step={step}
          setStep={setStep}
          isCoach={isCoach}
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          interactionId={interactionId}
          userName={data?.user.firstName}
          userId={userId}
          setIsTimerTicking={setIsTimerTicking}
          timerMinutes={minutesCounting * chatTimerCounter}
          isFinishButtonClicked={isFinishButtonClicked}
          isConfirmButtonClicked={isFinishButtonClicked}
        />
      )}
      <Image src={chatBackgroundImg} alt="chat background" className={styles.backgroundImg} />
      <div className={styles.content}>
        <Chat
          id={chatQuery?.id}
          setView={setView}
          view={view}
          interactionId={interactionId}
          userId={userId}
        />

        <div className={styles.problemDetails}>
          {isDetailsMobileOpen && (
            <div className={styles.detailsMobileOpen}>
              <div className={styles.text}>
                <span>{data?.description}</span>
              </div>
            </div>
          )}
          {chatCreateTime && interactionId && userId && !chatIsFinished && (
            <div className={styles.timeToEnd}>
              <div className={styles.timeDetails}>
                <div className={styles.time}>
                  <span className={styles.title}>{t('Timer_time_to_end')}</span>
                  <Timer
                    isChat
                    chatIsFinished={chatIsFinished}
                    paymentData={{ userId, interactionId }}
                    time={chatCreateTime}
                    minutesCounting={minutesCounting}
                    onTimeEnd={onTimeEnd}
                    isLine
                    isTicking={isTimerTicking}
                    isCoach={isCoach}
                    setTimerMinutes={setTimerMinutes}
                    pausedTime={pausedTime}
                  />
                </div>
                <div
                  className={styles.details}
                  onClick={() => setIsDetailsMobileOpen((prevState) => !prevState)}>
                  <span>{t('DetailsWrapper_problem_details')}</span>

                  <ChevronRightIconComponent
                    direction={isDetailsMobileOpen ? 'bottom' : 'top'}
                    color="#39aba4"
                  />
                </div>
              </div>
              <div className={styles.buttonsDetails}>
                <div className={styles.mobileDetails}>
                  <div className={styles.detailsAvatar}>
                    <div className={styles.avatar}>
                      <AvatarWithStatus imageSrc={imageSrc} userId={chatQuery?.userId} />
                    </div>
                    <div className={styles.details}>
                      <span className={styles.name}>{data?.user.firstName}</span>
                      <span
                        className={classNames(
                          styles.titleText,
                          isNeed ? styles.titleTextNeed : styles.titleTextOffer
                        )}>
                        {isNeed
                          ? t('ThreadConversation_need_title')
                          : t('ThreadConversation_offer_title')}
                      </span>
                      <span className={styles.title}>{data?.problemTitle}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.buttons}>
                  <Button
                    disabled={isLoading}
                    style={styles.button}
                    buttonColor="black"
                    onClick={onFinishChat}>
                    <>
                      <span className={styles.text}>{t('Timer_finish_chat')}</span>
                      <span className={styles.textMobile}>{t('Timer_finish_chat_mobile')}</span>
                    </>
                  </Button>
                  {view === View.CONVERSATION && (
                    <Button
                      disabled={isLoading}
                      style={styles.button}
                      buttonColor="black"
                      onClick={onPauseChat}>
                      <>
                        {' '}
                        <span className={styles.text}>{t('Timer_pause_chat')}</span>
                        <span className={styles.textMobile}>{t('Timer_pause_chat_mobile')}</span>
                      </>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={styles.moreDetails}>
            <div className={styles.detailsTitle}>
              <span className={styles.title}>
                {isNeed ? t('DetailsWrapper_problem_details') : t('DetailsWrapper_offer_details')}
              </span>
            </div>
            <div className={styles.details}>
              {data && (
                <Details
                  isNeed={isNeed}
                  description={data.description}
                  problemTitle={data.problemTitle}
                  hashtags={data.hashtags}
                  imageId={
                    'image' in data ? data.image.filename : data.representativePhoto.filename
                  }
                  category={data.area.name}
                  user={data.user}
                />
              )}
            </div>

            {isDogInView && View.CONVERSATION !== view && (
              <div className={styles.dog}>
                <video autoPlay loop muted className={styles.image} src="/dogRoll.mp4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default ChatPage;
