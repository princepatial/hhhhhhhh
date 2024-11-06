import { Field } from 'formik';
import styles from './FieldInput.module.scss';
import classNames from 'classnames';

type Props = {
  name: string;
  placeholder: string;
  type?: string;
  styleInput?: string | undefined;
  styleError?: string | undefined;
  styleWrapper?: string | undefined;
  error: string | undefined;
  touched: boolean | undefined;
  max?: number;
  min?: number;
  as?: 'input' | 'textarea' | 'select';
};

const FieldInput = ({
  styleInput,
  styleWrapper,
  styleError,
  error,
  touched,
  type = 'text',
  ...props
}: Props) => {
  return (
    <div className={classNames(styles.container, styleWrapper)}>
      <Field {...props} className={classNames(styles.input, styleInput)} />
      {error && touched && <p className={classNames(styles.error, styleError)}>{error}</p>}
    </div>
  );
};

export default FieldInput;
