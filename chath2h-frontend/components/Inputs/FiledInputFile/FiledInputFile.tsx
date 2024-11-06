import styles from './FiledInputFile.module.scss';
import classNames from 'classnames';
import { ChangeEventHandler } from 'react';

type Props = {
  name: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  styleWrapper?: string;
  styleInput?: string;
  styleError?: string;
  touched?: boolean | 'editable';
  accept?: string;
};

const FileInputFile = ({
  onChange,
  placeholder,
  name,
  styleWrapper,
  styleInput,
  error,
  styleError,
  touched,
  accept
}: Props) => {
  return (
    <div className={classNames(styles.container, styleWrapper)}>
      <label htmlFor={name} className={classNames(styleInput)}>
        {placeholder}
        <input type="file" id={name} accept={accept} name={name} onChange={onChange}></input>
      </label>
      {error && touched && <p className={classNames(styles.error, styleError)}>{error}</p>}
    </div>
  );
};

export default FileInputFile;
