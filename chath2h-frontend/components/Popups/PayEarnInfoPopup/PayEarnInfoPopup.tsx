import ConfirmPopup from '../ConfirmPopup';
import Dialog from '@components/Dialog';
import { useTranslation } from 'next-i18next';
import { StateSetterType } from 'globalTypes';
import { MouseEventHandler } from 'react';

type Props = {
  disabled?: boolean;
  isOpen: boolean;
  setIsOpen: StateSetterType<boolean>;
  isCoach?: boolean;
  isOnchain?: boolean;
  rightButtonEvent: MouseEventHandler<HTMLButtonElement>;
};

const PayEarnInfoPopup = ({
  isOpen,
  setIsOpen,
  isCoach = false,
  isOnchain = false,
  rightButtonEvent,
  disabled
}: Props) => {
  const { t } = useTranslation('common');

  const subtitle = isCoach
    ? t('PayEarnInfoPopup_subtitle_coach')
    : t('PayEarnInfoPopup_subtitle_user');

  const subTitleSecondText = isOnchain ? t('PayEarnInfoPopup_subtitle_onchain_info') : '';

  return (
    <Dialog isOpen={isOpen} handleClose={() => setIsOpen(false)}>
      <ConfirmPopup
        disabledRight={disabled}
        showLeftButton={false}
        rightButtonEvent={rightButtonEvent}
        rightButton={t('PayEarnInfoPopup_start_button')}
        title={t('PayEarnInfoPopup_title')}
        subTitle={subtitle}
        subTitleSecondText={subTitleSecondText}
      />
    </Dialog>
  );
};

export default PayEarnInfoPopup;
