import classNames from 'classnames';
import { StateSetterType } from 'globalTypes';
import { payment } from 'queries/chatQuery/chatQuery';
import { useEffect, useRef, useState } from 'react';
import styles from './Timer.module.scss';

type Props = {
  time?: Date;
  onTimeEnd?: () => void;
  style?: string;
  minutesCounting?: number;
  isLine?: boolean;
  paymentData?: { userId: string; interactionId: string };
  isTicking?: boolean;
  isCoach?: boolean;
  setTimerMinutes?: StateSetterType<number | null>;
  pausedTime?: number | 0;
  chatIsFinished?: boolean;
  isChat?: boolean;
};

const Timer = ({
  time,
  onTimeEnd,
  style,
  minutesCounting = 5,
  isLine,
  paymentData,
  isTicking = true,
  isCoach,
  setTimerMinutes,
  pausedTime = 0,
  chatIsFinished = false,
  isChat = false
}: Props) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const checkMinutes = useRef(1);

  useEffect(() => {
    if (time && onTimeEnd) {
      const interval = setInterval(() => {
        if (chatIsFinished) return;

        if (!isTicking) return;

        const timer = new Date(time).getTime() - Date.now() + pausedTime;

        const startedMinutes = Math.abs(Math.floor((timer / 1000 / 60) % 60));
        const startedSeconds = Math.abs(Math.floor((timer / 1000) % 60));
        const minutes = minutesCounting - startedMinutes;
        const seconds = 60 - startedSeconds;

        setTimerMinutes && setTimerMinutes(startedMinutes);

        if (paymentData && checkMinutes.current === startedMinutes && !isCoach) {
          payment(paymentData).catch((err) => console.log(err));
          checkMinutes.current++;
        }

        setMinutes(minutes);
        setSeconds(seconds);

        if ((minutes === 0 && seconds === 0) || minutes < 0) {
          onTimeEnd();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTicking, paymentData, isCoach, chatIsFinished]);

  if (!time) return;

  return (
    <div className={classNames(styles.timer, isChat && styles.timerMobileChat)}>
      {isLine && (
        <div className={styles.lines}>
          <div
            className={styles.line}
            style={{
              width: ((minutes * 60 + seconds) / (minutesCounting * 60)) * 100 + '%'
            }}></div>
          <div className={styles.lineGrey}></div>
        </div>
      )}

      <span className={classNames(style, styles.timerCounter, isLine && styles.timerCounterLine)}>
        {time ? `${minutes + ':' + (seconds < 10 ? '0' + seconds : seconds)}` : '00:00'}
      </span>
    </div>
  );
};
export default Timer;
