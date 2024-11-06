import classNames from 'classnames';
import { useState } from 'react';

type PropsTextArea = {
  onEnterClicked: () => void;
  messageText: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeHolder: string;
  style?: string;
  limit?: number;
};

const TextAreaChat = ({
  onEnterClicked,
  messageText,
  onChange,
  placeHolder,
  style,
  limit = 400
}: PropsTextArea) => {
  const [isShiftClicked, setIsShiftClicked] = useState(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code.includes('Shift')) {
      setIsShiftClicked(true);
    }
    if (!isShiftClicked && e.code === 'Enter') {
      onEnterClicked();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code.includes('Shift')) {
      setIsShiftClicked(false);
    }
  };
  return (
    <textarea
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      value={messageText}
      maxLength={limit}
      className={classNames(style)}
      onChange={onChange}
      placeholder={placeHolder}
    />
  );
};

export default TextAreaChat;
