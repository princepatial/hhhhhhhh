import { MouseEventHandler } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames';
import { ButtonColor } from 'globalTypes';

type ButtonType = 'submit' | 'reset' | 'button';

type Props = {
  disabled?: boolean;
  type?: ButtonType;
  text?: string;
  style?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => Promise<void>);
  buttonColor?: ButtonColor;
  children?: string | JSX.Element | JSX.Element[];
};

const Button = ({
  text,
  style,
  type = 'button',
  onClick,
  disabled,
  buttonColor = 'green',
  children,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={disabled}
      onClick={(e) => {
        if (onClick && !disabled) {
          onClick(e);
        }
      }}
      type={type}
      className={classNames(style, styles.button, styles[buttonColor])}>
      {children}
      {text}
    </button>
  );
};

export default Button;
