import styles from './messages.module.scss';
import { EnvelopeIconComponent } from '@components/icons';
import classNames from 'classnames';
import { MouseEventHandler } from 'react';
import colorScheme from '@helpers/color-scheme';

interface MessagesComponentProps {
  messageCount?: number;
  onClick?: MouseEventHandler;
  color?: string;
  floating?: boolean;
}

const MessagesComponent = ({
  messageCount,
  color = colorScheme.white,
  floating = false,
  onClick = () => {}
}: MessagesComponentProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        styles.messages,
        !!messageCount && styles.animated,
        floating && styles.floating
      )}>
      {!!messageCount && <span className={styles.newMessage}>{messageCount}</span>}
      <EnvelopeIconComponent width={floating ? 52 : 30} height={floating ? 35 : 20} color={color} />
    </div>
  );
};
export default MessagesComponent;
