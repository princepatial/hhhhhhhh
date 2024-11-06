import prevArrowImg from '@images/prev-arrow.svg';
import Button from 'components/Button';
import Image from 'next/image';
import { FormEventHandler, useMemo } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import styles from './CalendarForm.module.scss';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { useTranslation } from 'next-i18next';

type Props = {
  date: Value;
  onBackClick: () => void;
  onDateChange: CalendarProps['onChange'];
  handleSubmit: FormEventHandler;
  isButtonDisabled: boolean;
};

const CalendarForm = ({
  date,
  onBackClick,
  onDateChange,
  handleSubmit,
  isButtonDisabled
}: Props) => {
  const { t } = useTranslation('common');
  const endDate = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() + 14);
    return end;
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {t('CalendarForm_firstText')}
        <div className={styles.secondParagraph}>{t('CalendarForm_secondText')}</div>
      </div>
      <div>
        <Calendar
          onChange={onDateChange}
          value={date}
          maxDate={endDate}
          minDate={new Date()}
          minDetail="month"
          next2Label={null}
          prev2Label={null}
          formatWeekday={(date) => (date ? date.substring(0, 2) : '')}
          prevLabel={<Image alt="prev arrow" src={prevArrowImg} width={6} height={10} />}
          nextLabel={
            <Image
              alt="next arrow"
              src={prevArrowImg}
              width={6}
              height={10}
              className={styles.nextArrow}
            />
          }
        />
        <div className={styles.buttons}>
          <Button
            buttonColor="whiteGreen"
            text="Back"
            style={styles.button}
            onClick={onBackClick}
          />
          <Button
            disabled={!date || isButtonDisabled}
            text="Confirm offer"
            style={styles.button}
            buttonColor="green"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarForm;
