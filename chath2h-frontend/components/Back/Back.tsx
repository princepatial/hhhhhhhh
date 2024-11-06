import { useTranslation } from 'next-i18next';
import styles from './Back.module.scss';
import Image from 'next/image';
import arrowBack from '@images/arrow_green.svg';
import arrowBackMobile from '@images/open_arrow.svg';

type Props = {
  text?: string;
  onClick?: () => void;
};

const Back = ({ text = 'coaches_back_to_list', onClick }: Props) => {
  const { t } = useTranslation('common');
  return (
    <div onClick={onClick} className={styles.backToList}>
      <Image src={arrowBack} width={16} height={16} className={styles.arrow} alt="arrowBack" />
      <Image
        src={arrowBackMobile}
        width={10}
        height={10}
        className={styles.arrowMobile}
        alt="arrowBack"
      />
      <span>{t(text)}</span>
    </div>
  );
};

export default Back;
