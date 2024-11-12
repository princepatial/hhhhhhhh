import ConfirmPopup from '../ConfirmPopup';
import Dialog from '@components/Dialog';
import SelectTokens from '@components/SelectTokens';
import styles from './BuyNewTokensPopup.module.scss';
import { useTranslation } from 'next-i18next';
import { StateSetterType } from 'globalTypes';
import axios from 'axios';
import { useState } from 'react';

type Props = {
  isOpen: boolean;
  setIsDialogOpen: StateSetterType<boolean>;
  title: string;
  subTitle?: string;
  rightButtonText: string;
  textAfterSubTitle?: boolean;
};

const BuyNewTokensPopup = ({
  isOpen,
  setIsDialogOpen,
  title,
  subTitle,
  rightButtonText,
  textAfterSubTitle
}: Props) => {
  const { t } = useTranslation('common');
  const getPaymentSession = async () => {
    const registerResponse = await axios.post('http://localhost:3001/api/payment/session', {quantity: activeAmount});
    window.location.href = registerResponse.data.redirectUrl;
  };
  const [activeAmount, setActiveAmount] = useState<number>(0); 
  const handleActiveAmountChanged = (amount: number) => {
    setActiveAmount(amount);
  };
  return (
    <Dialog isOpen={isOpen} handleClose={() => setIsDialogOpen(false)}>
      <ConfirmPopup
        title={title}
        subTitle={subTitle}
        showLeftButton={false}
        subTitleStyle={styles.subTitle}
        rightButton={rightButtonText}
        rightButtonEvent={() => getPaymentSession()}
        rightButtonColor={'green'}>
        <>
          {textAfterSubTitle && (
            <span className={styles.textAfterSubTitle}>
              {t('ButNewTokensPopup_text_after_subtitle')}
            </span>
          )}
          <SelectTokens onActiveAmountChanged={handleActiveAmountChanged} />
        </>
      </ConfirmPopup>
    </Dialog>
  );
};

export default BuyNewTokensPopup;
