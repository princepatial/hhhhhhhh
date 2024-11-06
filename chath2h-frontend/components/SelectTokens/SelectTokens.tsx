import Button from 'components/Button';
import styles from './SelectTokens.module.scss';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import * as Yup from 'yup';
import { useTranslation } from 'next-i18next';

interface SelectTokensProps {
  amountList?: number[];
  limitNumberInput?: number;
  onActiveAmountChanged?: (amount: number) => void;
}
const SelectTokens: React.FC<SelectTokensProps> = ({
  amountList = [25, 50, 100, 200],
  limitNumberInput = 5,
  onActiveAmountChanged
}) => {
  const { t } = useTranslation('common');
  const [activeAmount, setActiveAmount] = useState<number>(amountList[0]);
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleAmountChanged = (amount: number) => {
    setActiveAmount(amount);
    if (onActiveAmountChanged) {
      onActiveAmountChanged(amount);
    }
  };

  const validationSchema = Yup.number().required('Required').min(2);

  const onFocus = () => {
    if (isValid) {
      handleAmountChanged(parseInt(inputValue));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue =
      e.target.value.length > limitNumberInput ? inputValue : e.target.value.replace(/[^0-9]/g, '');
    if (parseInt(numericValue) < 2) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setInputValue(numericValue);
    if (numericValue && parseInt(numericValue) > 1) {
      handleAmountChanged(parseInt(numericValue));
    } else {
      handleAmountChanged(amountList[0]);
    }
  };

  useEffect(() => {
    validationSchema.isValid(inputValue).then((res) => {
      setIsValid(res);
    });
  }, [inputValue, validationSchema]);

  useEffect(() => {
    handleAmountChanged(amountList[0]);
  }, []);

  return (
    <div className={styles.container}>
      {amountList.map((item: number, index) => (
        <Button
          style={styles.button}
          key={index}
          onClick={() => handleAmountChanged(item)}
          buttonColor={item === activeAmount ? 'green' : 'whiteGreen'}
          text={item.toString()}
        />
      ))}
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          className={classNames(
            activeAmount === parseInt(inputValue) && styles.active,
            styles.input
          )}
          id="inputTokens"
          placeholder={t('SelectToken_other')}
          onFocus={onFocus}
          onChange={onChange}
        />
        {isError && (
          <div className={styles.error}>
            <span>At least 2 tokens</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectTokens;
