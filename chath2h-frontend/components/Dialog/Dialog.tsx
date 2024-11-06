import React, { MouseEventHandler } from 'react';
import styles from './Dialog.module.scss';
import classNames from 'classnames';

type Props = {
  isOpen: boolean;
  title?: string;
  handleClose?: MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
  closeIsPresent?: boolean;
  isOtherPopupOpen?: boolean;
  style?: string;
};

const Dialog = ({
  isOpen,
  handleClose,
  title,
  children,
  closeIsPresent = true,
  isOtherPopupOpen,
  style
}: Props) => {
  if (!isOpen) return null;
  return (
    <>
      <div className={styles.backdrop} />
      <div
        className={classNames(
          !title && styles.dialogConfirm,
          styles.dialog,
          isOtherPopupOpen && styles.isOtherPopupOpen,
          style
        )}>
        <div className={styles.modal}>
          {title && (
            <>
              <h1 className={styles.header}>{title}</h1>
              <div className={styles.line} />
            </>
          )}
          {closeIsPresent && <button className={styles.close} onClick={handleClose} />}

          {children}
        </div>
      </div>
    </>
  );
};
export default Dialog;
