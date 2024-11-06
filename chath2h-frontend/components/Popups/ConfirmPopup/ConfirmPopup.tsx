import styles from './ConfirmPopup.module.scss';
import { MouseEventHandler } from 'react';
import Button from 'components/Button';
import { useTranslation } from 'next-i18next';
import { ButtonColor } from 'globalTypes';

type Props = {
  subTitle?: string;
  subTitleStyle?: string;
  title?: string;
  rightButton?: string;
  leftButton?: string;
  showLeftButton?: boolean;
  rightButtonEvent: MouseEventHandler<HTMLButtonElement>;
  leftButtonEvent?: MouseEventHandler<HTMLButtonElement>;
  children?: string | JSX.Element | JSX.Element[];
  rightButtonColor?: ButtonColor;
  leftButtonColor?: ButtonColor;
  disabledRight?: boolean;
  disabledLeft?: boolean;
  rightButtonStyle?: string;
  leftButtonStyle?: string;
  subTitleSecondText?: string;
};

const ConfirmPopup = ({
  title,
  subTitleStyle,
  leftButton,
  rightButton,
  subTitle,
  subTitleSecondText,
  showLeftButton = true,
  rightButtonEvent,
  leftButtonEvent,
  children,
  leftButtonColor = 'whiteGreen',
  rightButtonColor = 'green',
  disabledRight,
  disabledLeft,
  rightButtonStyle,
  leftButtonStyle
}: Props) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title || t('ConfirmPopup_title')}</h1>
      {subTitle && <span className={subTitleStyle}>{subTitle}</span>}
      {subTitleSecondText && <span>{subTitleSecondText}</span>}
      {children}
      <div className={styles.buttons}>
        {showLeftButton && (
          <Button
            style={leftButtonStyle}
            disabled={disabledLeft}
            buttonColor={leftButtonColor}
            onClick={leftButtonEvent}
            text={leftButton || t('ConfirmPopup_button_cancel')}
          />
        )}
        <Button
          style={rightButtonStyle}
          buttonColor={rightButtonColor}
          onClick={rightButtonEvent}
          disabled={disabledRight}
          text={rightButton || t('ConfirmPopup_button_delete')}
        />
      </div>
    </div>
  );
};

export default ConfirmPopup;
