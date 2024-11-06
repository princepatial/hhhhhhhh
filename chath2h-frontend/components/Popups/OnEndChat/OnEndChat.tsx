import Dialog from '@components/Dialog';
import BuyNewTokensPopup from '@components/Popups/BuyNewTokensPopup';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import StarIconComponent from '@components/icons/star-icon/star-icon.component';
import colorScheme from '@helpers/color-scheme';
import { DialogStep, StateSetterType, View } from 'globalTypes';
import { checkIfUserHasTokens } from 'hooks/checkIfUserHasTokens';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { finishChat, rateCoach } from 'queries/chatQuery/chatQuery';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { socket } from 'socket';
import styles from './OnEndChat.module.scss';

type Props = {
  timerMinutes: number;
  isCoach: boolean;
  userName: string;
  interactionId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: StateSetterType<boolean>;
  userId: string;
  isFinishButtonClicked: boolean;
  setStep: StateSetterType<DialogStep>;
  step: DialogStep;
  setIsTimerTicking: StateSetterType<boolean>;
  setView: StateSetterType<View>;
  setChatCreateTime: StateSetterType<Date | null>;
  interactionRequestId: string;
  isConfirmButtonClicked: boolean;
  chatFinishedTokenAmount: number;
  chatFinishedDuration: number;
  onFinishChatShowSummary: () => void;
};

const OnEndChat = ({
  chatFinishedDuration,
  chatFinishedTokenAmount,
  interactionRequestId,
  setChatCreateTime,
  setView,
  isDialogOpen,
  setIsDialogOpen,
  interactionId,
  isCoach,
  userName,
  userId,
  timerMinutes: leftTime,
  isFinishButtonClicked,
  setStep,
  step,
  setIsTimerTicking,
  isConfirmButtonClicked,
  onFinishChatShowSummary
}: Props) => {
  const [rateHover, setRateHover] = useState<number | null>();
  const [coachRate, setCoachRate] = useState<number | null>(null);
  const { t } = useTranslation('common');

  const stepsText = {
    onTimeEnd: {
      title: isFinishButtonClicked
        ? t('OnEndChat_time_end_title_finish_button')
        : t('OnEndChat_time_end_title'),
      subtitle: isFinishButtonClicked
        ? ''
        : t('OnEndChat_time_end_subtitle1') + ` ${leftTime} ` + t('OnEndChat_time_end_subtitle2'),
      subTitleSecondText: isFinishButtonClicked
        ? ''
        : t('OnEndChat_time_end_subtitle3') +
          (isCoach
            ? t('OnEndChat_time_end_subtitle_coach1')
            : t('OnEndChat_time_end_subtitle_user')),
      rightButtonText: t('OnEndChat_time_end_right_button'),
      leftButtonText: isFinishButtonClicked
        ? t('OnEndChat_time_end_title_finish_button_left_button')
        : t('OnEndChat_time_end_left_button')
    },
    onBuy: {
      title: t('OnEndChat_on_buy_title'),
      subtitle: t('OnEndChat_on_buy_subtitle'),
      rightButtonText: t('OnEndChat_on_buy_right_button')
    },
    onEnd: {
      title: t('OnEndChat_on_end_title'),
      subTitle:
        t('OnEndChat_on_end_subtitle1') +
        ` ${chatFinishedDuration} ` +
        t('OnEndChat_on_end_subtitle2'),
      subTitleSecondText: `${chatFinishedTokenAmount} ${
        isCoach
          ? t('OnEndChat_on_end_subtitle_second_coach')
          : t('OnEndChat_on_end_subtitle_second_user')
      }`,
      rightButtonText: t('OnEndChat_on_end_right_button')
    }
  };

  const router = useRouter();

  const onContinueChatCheckTokens = async () => {
    const hasTokens = await checkIfUserHasTokens();
    if (!hasTokens) {
      setStep(DialogStep.BUY);
    } else {
      socket.emit(
        'rejoinInteraction',
        (socket.io, JSON.stringify({ interactionId, interactionRequestId }))
      );
    }
  };
  socket.on('InteractionRejoinedRequest', () => {
    setView(View.WAITING);
    setChatCreateTime(null);
    setIsDialogOpen(false);
    setIsTimerTicking(true);
  });
  const redirectEvent = () => router.push('/dashboard');

  const confirmPopupEvent = () => {
    if (isFinishButtonClicked) {
      onFinishChatShowSummary();
    } else {
      onContinueChatCheckTokens();
    }
  };

  const confirmEndPopup = () => {
    if (typeof coachRate === 'number' && interactionId) {
      rateCoach(interactionId, coachRate);
      setCoachRate(null);
    }
    redirectEvent();
  };

  const handleClose = () => {
    step !== DialogStep.END && isFinishButtonClicked ? setIsDialogOpen(false) : () => {};
  };

  useEffect(() => {
    const timeout = setTimeout(() => onFinishChatShowSummary(), 2 * 60 * 1000);
    if (!isDialogOpen || step !== DialogStep.TIME_END || isFinishButtonClicked)
      clearTimeout(timeout);
    return () => {
      clearTimeout(timeout);
    };
  }, [isDialogOpen, step, isFinishButtonClicked]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (step === DialogStep.END) {
      timeoutId = setTimeout(() => {
        router.push('/dashboard');
      }, 30 * 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [step]);

  const { onTimeEnd, onBuy, onEnd } = stepsText;
  const stepIsTimeEnd = step === DialogStep.TIME_END;

  const handleLeftButton = () => {
    isFinishButtonClicked ? setIsDialogOpen(false) : onFinishChatShowSummary();
  };

  return (
    <>
      {step === DialogStep.BUY ? (
        <BuyNewTokensPopup
          textAfterSubTitle
          title={onBuy.title}
          subTitle={onBuy.subtitle}
          rightButtonText={onBuy.rightButtonText}
          isOpen={isDialogOpen}
          setIsDialogOpen={() => setIsDialogOpen(false)}
        />
      ) : null}
      {step === DialogStep.TIME_END ? (
        <Dialog isOpen={isDialogOpen} handleClose={handleClose}>
          <ConfirmPopup
            rightButtonEvent={confirmPopupEvent}
            rightButton={stepIsTimeEnd ? onTimeEnd.rightButtonText : onEnd.rightButtonText}
            leftButton={onTimeEnd.leftButtonText}
            leftButtonEvent={handleLeftButton}
            showLeftButton={stepIsTimeEnd}
            title={stepIsTimeEnd ? onTimeEnd.title : onEnd.title}
            subTitle={stepIsTimeEnd ? onTimeEnd.subtitle : onEnd.subTitle}
            subTitleSecondText={
              stepIsTimeEnd ? onTimeEnd.subTitleSecondText : onEnd.subTitleSecondText
            }
            subTitleStyle={styles.subTitleStyle}
            rightButtonStyle={styles.rightButton}
            leftButtonStyle={isFinishButtonClicked ? '' : styles.leftButton}
          />
        </Dialog>
      ) : null}
      {step === DialogStep.END ? (
        <Dialog isOpen={isDialogOpen} handleClose={handleClose}>
          <ConfirmPopup
            rightButtonEvent={confirmEndPopup}
            rightButton={onEnd.rightButtonText}
            title={onEnd.title}
            subTitle={onEnd.subTitle}
            leftButtonEvent={redirectEvent}
            subTitleSecondText={onEnd.subTitleSecondText}
            subTitleStyle={styles.subTitleStyle}
            rightButtonStyle={styles.rightButton}
            leftButtonStyle={isFinishButtonClicked ? '' : styles.leftButton}
            disabledRight={!isCoach ? typeof coachRate !== 'number' : false}>
            <>
              {!isCoach && (
                <div className={styles.ratings}>
                  <div className={styles.title}>{t('OnEndChat_rate_coach')}</div>
                  <div className={styles.stars}>
                    {[...Array(6)].map((star, index) => (
                      <div className={styles.starCol} key={index}>
                        <button
                          className={styles.starButton}
                          onClick={() => setCoachRate(index)}
                          onMouseEnter={() => setRateHover(index)}
                          onMouseLeave={() => setRateHover(coachRate)}>
                          <StarIconComponent
                            height={40}
                            width={40}
                            color={
                              (typeof rateHover === 'number' && rateHover >= index) ||
                              (typeof coachRate === 'number' && coachRate >= index)
                                ? colorScheme.darkYellow
                                : colorScheme.grey
                            }
                          />
                        </button>
                        {index}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          </ConfirmPopup>
        </Dialog>
      ) : null}
    </>
  );
};

export default OnEndChat;
