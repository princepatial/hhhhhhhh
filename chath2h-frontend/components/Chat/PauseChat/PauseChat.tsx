import { useState } from 'react';
import { socket } from 'socket';
import { StateSetterType } from 'globalTypes';
import { useSocket } from 'hooks/useSocket';
import Dialog from '@components/Dialog';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import { useTranslation } from 'next-i18next';

type PauseChatProps = {
  interactionId: string | null;
  setIsTimerTicking: StateSetterType<boolean>;
  pauseButtonClicked: boolean;
  setIsPauseButtonClicked: StateSetterType<boolean>;
  setIsFinishButtonClicked: StateSetterType<boolean>;
  onFinishChatShowSummary: () => void;
  setPausedTime: StateSetterType<number>;
  setPauseTimestamp: StateSetterType<number>;
  pauseTimestamp: number;
};

export default function PauseChat({
  interactionId,
  setIsTimerTicking,
  setIsPauseButtonClicked,
  pauseButtonClicked,
  setIsFinishButtonClicked,
  onFinishChatShowSummary,
  setPausedTime,
  setPauseTimestamp,
  pauseTimestamp
}: PauseChatProps) {
  const { t } = useTranslation('common');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [leftButton, setLeftButton] = useState<string>();
  const [isInitiator, setIsInitiator] = useState(false);
  const [closeIsPresent, setCloseIsPresent] = useState(true);

  const handleCancelPause = () => {
    socket.emit('resumeInteraction', (socket.io, JSON.stringify({ interactionId })));
  };

  const socketOnPauseChat = (e: any) => {
    setPauseTimestamp(Date.now());
    setIsTimerTicking(false);
    setIsPauseButtonClicked(true);
    if (e.pauseInitiatorSocketId !== socket.id) {
      setTitle(`${t('Chat_paused_by')} ${e.initiatorName}`);
      setSubtitle(t('Chat_paused_by_info'));
      setIsInitiator(false);
      setCloseIsPresent(false);
    } else {
      setCloseIsPresent(true);
      setIsInitiator(true);
      setTitle(t('Chat_paused_by_user'));
      setSubtitle(t('Chat_resume_info'));
      setLeftButton(t('Chat_resume'));
    }
  };

  const socketOnResumeChat = () => {
    const pauseTime = Date.now() - pauseTimestamp;
    setPausedTime((prev) => prev + pauseTime);
    setPauseTimestamp(0);
    setIsPauseButtonClicked(false);
    setIsTimerTicking(true);
  };

  useSocket('InteractionPausedRequest', socketOnPauseChat);
  useSocket('InteractionResumedRequest', socketOnResumeChat);

  const handleFinishButton = () => {
    setIsFinishButtonClicked(true);
    onFinishChatShowSummary();
  };

  return (
    <Dialog
      isOpen={pauseButtonClicked}
      handleClose={handleCancelPause}
      closeIsPresent={closeIsPresent}>
      <ConfirmPopup
        rightButtonEvent={handleFinishButton}
        title={title}
        subTitle={subtitle}
        leftButton={leftButton}
        leftButtonEvent={handleCancelPause}
        showLeftButton={isInitiator}
        rightButton={t('Timer_finish_chat')}
      />
    </Dialog>
  );
}
