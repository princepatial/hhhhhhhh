import classNames from 'classnames';
import styles from './Wrapper.module.scss';

type Props = {
  children: JSX.Element;
  stylesWrapper?: string;
  stylesBox?: string;
  title?: string;
};

const Wrapper = ({ children, stylesBox, stylesWrapper, title }: Props) => {
  return (
    <div className={classNames(styles.container, stylesWrapper)}>
      <div className={classNames(styles.box, stylesBox)}>
        {title && (
          <h1 className={styles.title}>
            {title}
            <div className={styles.border}></div>
          </h1>
        )}
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
