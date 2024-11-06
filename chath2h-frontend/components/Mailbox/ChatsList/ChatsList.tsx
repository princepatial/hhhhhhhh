import classNames from 'classnames';
import styles from '../SingleThread/SingleThread.module.scss';
import AvatarWithStatus from '@components/AvatarWithStatus';
import Image from 'next/image';
import openArrowImg from '@images/open_arrow.svg';
import { useState } from 'react';
import { InteractionRecipent, Need, Offer, StateSetterType, userIdNeedId } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import ConversationTile from '../ConversationTile';
import { useTranslation } from 'next-i18next';

type Props = {
  recipient: InteractionRecipent;
  setCurrentNeedOffer: StateSetterType<userIdNeedId | null>;
  currentNeedOffer: userIdNeedId | null;
  needOffer: Need[] | Offer[];
  setIsActiveChat: StateSetterType<boolean>;
};

const ChatList = ({
  recipient,
  setCurrentNeedOffer,
  needOffer,
  currentNeedOffer,
  setIsActiveChat
}: Props) => {
  const { t } = useTranslation('common');
  const [showConversations, setShowConversations] = useState(false);
  const onClickThread = () => {
    setShowConversations((prevState) => !prevState);
  };
  const imageSrc = useImageUrl(recipient.avatar);

  const onClickNeedOffer = (needOfferId: string, title: string, isNeed: boolean) => {
    setIsActiveChat(true);
    setCurrentNeedOffer({
      id: recipient._id,
      idNeed: needOfferId,
      title,
      isNeed
    });
  };

  return (
    <div className={styles.container}>
      <div className={classNames(styles.thread)} onClick={onClickThread}>
        <AvatarWithStatus imageSrc={imageSrc} userId={recipient._id} />
        <div className={styles.middleCol}>
          <span className={styles.user}>{recipient.firstName}</span>
          {needOffer.length && (
            <span className={styles.greyText}>
              {needOffer.length} {t('ChatList_conversation')}
            </span>
          )}
        </div>
        {needOffer.length && (
          <Image
            src={openArrowImg}
            alt="open thread conversations"
            className={classNames(styles.openArrow, !showConversations && styles.openThreadArrow)}
          />
        )}
      </div>
      <div className={styles.line} />

      {showConversations &&
        needOffer.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => onClickNeedOffer(item._id, item.problemTitle, 'image' in item)}>
              {!!item && (
                <ConversationTile
                  isNeed={'image' in item}
                  text={item.problemTitle}
                  isSelected={currentNeedOffer?.idNeed === item._id}
                />
              )}
              <div className={styles.line} />
            </div>
          );
        })}
    </div>
  );
};

export default ChatList;
