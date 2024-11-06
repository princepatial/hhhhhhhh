import { FC, MouseEventHandler } from 'react';
import styles from './Box.module.scss';
import classNames from 'classnames';

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  active?: Boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const Box: FC<BoxProps> = ({ children, active = true, onClick }) => {
  return (
    <div
      className={classNames(styles.container, !active && styles.inActive, styles.className)}
      onClick={onClick}>
      {children}
    </div>
  );
};

export default Box;
