import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styles from './EmailForm.module.scss';
import axios from 'axios';
import FieldInputIcon from 'components/Inputs/FieldInputIcon';
import EmailIcon from '@images/email.svg';
import { useState } from 'react';
import classNames from 'classnames';
import Button from 'components/Button';
import { useTranslation } from 'next-i18next';

type Form = {
  email: string;
};

type MessageStatus = 'success' | 'failed' | 'default';

const EmailForm = () => {
  const { t } = useTranslation('common');
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation_email')).required(t('Register_required'))
  });

  const [messageSendStatus, setMessageSendStatus] = useState<MessageStatus>('default');
  const handleSubmit = async (values: Form) => {
    try {
      await axios.post(`http://localhost:3001/api/auth`, {
        destination: values.email
      });
    } catch (err) {
      console.log(err);
      setMessageSendStatus('failed');
      return;
    }
    setMessageSendStatus('success');
  };

  const Header = () => {
    return (
      <h1 className={styles.title}>
        <span>{t('EmailForm_header_1')} </span>
        {t('EmailForm_header_2')} <br /> {t('EmailForm_header_3')} H2HCoach
      </h1>
    );
  };

  return (
    <div className={styles.container}>
      {messageSendStatus !== 'success' ? (
        <div className={classNames(styles.box, styles.formBox)}>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, touched, isValid }) => {
              return (
                <Form className={styles.form}>
                  <Header />
                  <span className={styles.subtitle}>{t('EmailForm_send_activation_link')}</span>
                  <FieldInputIcon
                    name="email"
                    placeholder={t('EmailForm_email_input_placeholder')}
                    type="email"
                    styleInputWrapper={styles.inputWrapper}
                    styleInput={styles.input}
                    error={errors?.email}
                    touched={touched?.email}
                    icon={EmailIcon}
                    iconAlt="email-icon"
                  />
                  <div className={styles.buttons}>
                    <Button
                      type="submit"
                      disabled={!isValid}
                      text={t('EmailForm_submit_button_text_register')}
                      style={styles.button}
                    />
                    <Button
                      type="submit"
                      disabled={!isValid}
                      text={t('EmailForm_submit_button_text_login')}
                      style={styles.button}
                    />
                  </div>

                  {messageSendStatus === 'failed' && (
                    <span className={classNames(styles.errorText, styles.messageBack)}>
                      {t('EmailForm_send_activation_link_error')}
                    </span>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : (
        <div className={classNames(styles.box, styles.successBox)}>
          <div className={styles.success}>
            <Header />
            <div className={classNames(styles.successText, styles.messageBack)}>
              {t('EmailForm_send_activation_link_fallback')}
            </div>
            <div className={classNames(styles.successText, styles.messageBack)}>
              {t('EmailForm_send_info_spam')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailForm;
