import greenArrowImg from '@images/arrow_green.svg';
import redArrowImg from '@images/arrow_red.svg';
import classNames from 'classnames';
import Image from 'next/image';
import styles from './ConversationTile.module.scss';

type Props = {
  text: string;
  isNeed?: boolean;
  isSelected?: boolean;
  isMessagesNotViewed?: boolean;
};

const ConversationTile = ({
  text,
  isNeed = false,
  isSelected = false,
  isMessagesNotViewed = false
}: Props) => {
  return (
    <div className={classNames(styles.conversationTile, isSelected && styles.selected)}>
      <Image
        src={isNeed ? redArrowImg : greenArrowImg}
        alt={isNeed ? 'need tile' : 'coach offer tile'}
      />
      <span
        className={classNames(styles.problemTitle, isMessagesNotViewed && styles.notViewedTitle)}>
        {text}
      </span>
    </div>
  );
};

export default ConversationTile;
