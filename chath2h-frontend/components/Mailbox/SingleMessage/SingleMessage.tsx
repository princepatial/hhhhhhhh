import classNames from 'classnames';
import { GetMessage, Message } from 'globalTypes';
import styles from './SingleMessage.module.scss';
import AvatarWithStatus from '@components/AvatarWithStatus';
import { useTranslation } from 'next-i18next';
import { separatorTranslate } from 'helpers';

type PropsMessage = {
  message: Message | GetMessage;
  isNeed?: boolean;
  avatar: string;
  userId: string;
  isMailbox?: boolean;
  coachId?: string;
};

const SingleMessage = ({ message, isNeed, userId, isMailbox, coachId, avatar }: PropsMessage) => {
  const { t } = useTranslation('common');
  if (!userId) return;
  const isMe =
    typeof message.from !== 'string' ? userId === message.from._id : userId === message.from;
  const imCoach = coachId === userId;
  const isNeedHelpMessage = (isNeed && isMe) || (!isNeed && !isMe);

  const isSystemMessage =
    'systemMessage' in message && message?.systemMessage ? message?.systemMessage : undefined;

  const checkIfSeparatorCharacter = (content: string) => {
    const splicedContent = content.split(separatorTranslate);
    return splicedContent.map(
      (message: string, index) => (index === 1 ? message : t(message)) + ' '
    );
  };

  const contentMessage = isSystemMessage
    ? checkIfSeparatorCharacter(message.content)
    : message.content;

  return (
    <div
      className={classNames(
        styles.conversationTile,
        !isMe ? styles.needPosition : styles.offerPosition
      )}>
      <div className={styles.avatar}>
        <AvatarWithStatus imageSrc={avatar} />
      </div>
      <div
        className={classNames(
          styles.message,
          isMailbox && isNeedHelpMessage && styles.needTile,
          !isMailbox && styles.chat,
          isMe
            ? imCoach
              ? styles.borderGreen
              : styles.borderRed
            : !imCoach
            ? styles.borderGreen
            : styles.borderRed
        )}>
        {contentMessage}
      </div>
    </div>
  );
};

export default SingleMessage;
