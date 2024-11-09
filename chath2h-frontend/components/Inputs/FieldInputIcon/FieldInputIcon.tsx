import { Field } from 'formik';
import styles from './FieldInputIcon.module.scss';
import classNames from 'classnames';
import Image from 'next/image';

type Props = {
  name: string;
  placeholder: string;
  type: string;
  styleInput?: string | undefined;
  styleError?: string | undefined;
  styleInputWrapper?: string | undefined;
  error: string | undefined;
  touched: boolean | undefined;
  icon?: string;
  iconAlt?: string;
  iconStyle?: string;
  disabled?: boolean;
};

const FieldInputIcon = ({
  styleInput,
  styleInputWrapper,
  styleError,
  error,
  touched,
  icon,
  iconAlt,
  iconStyle,
  ...props
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.inputWrapper, styleInputWrapper)}>
        {icon && iconAlt && (
          <Image src={icon} alt={iconAlt} className={classNames(iconStyle)}></Image>
        )}
        <Field {...props} className={classNames(styles.input, styleInput)} />
      </div>
      {error && touched && <p className={classNames(styles.error, styleError)}>{error}</p>}
    </div>
  );
};

export default FieldInputIcon;
