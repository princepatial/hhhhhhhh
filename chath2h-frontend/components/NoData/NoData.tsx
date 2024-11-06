import styles from './NoData.module.scss';
import Image from 'next/image';
import noDataImg from '@images/noData.png';
import { useTranslation } from 'next-i18next';

const NoData = () => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.noData}>
      <div className={styles.image}>
        <Image src={noDataImg} alt="No data" fill style={{ objectFit: 'cover' }} />
      </div>
      <span>{t('MainContent_noData')}</span>
    </div>
  );
};

export default NoData;
