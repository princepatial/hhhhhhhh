import { useTranslation } from 'next-i18next';
import styles from './WelcomeMessage.module.scss';
import classNames from 'classnames';

type Props = {
  backToMessages?: () => void;
};

const WelcomeMessage = ({ backToMessages }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {backToMessages && (
        <button className={classNames(styles.back, styles.isHidden)} onClick={backToMessages}>
          {t('ThreadConversation_back_to_messages')}
        </button>
      )}
      <h2 className={styles.title}>{t('WelcomeMessage_title')}!</h2>
      <span className={styles.subTitle}>{t('WelcomeMessage_paragraph_1')}</span>
      <div className={styles.smallTile}>{t('WelcomeMessage_sub_title')}?</div>
      <span className={styles.subTitle}>{t('WelcomeMessage_paragraph_2')}</span>
    </>
  );
};

export default WelcomeMessage;
