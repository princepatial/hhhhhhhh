import Button from 'components/Button';
import FieldInput from 'components/Inputs/FieldInput';
import ImageUpload from 'components/Inputs/ImageUpload';
import { Form, Formik } from 'formik';
import { FILE_SIZE, SUPPORTED_FORMATS } from 'helpers';
import * as Yup from 'yup';
import styles from './HelpForm.module.scss';
import fieldStyles from '../../Inputs/FieldInput/FieldInput.module.scss';
import { HelpFormValues } from 'globalTypes';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import classNames from 'classnames';
import DeleteResolvedButtons from '@components/NeedsAndOffer/CrudOfferNeed/DeleteResolvedButtons';

type Form = {
  title: string;
  description: string;
  hashtags: string;
  image: any;
};

type Props = {
  onClose: () => void;
  handleSubmit: (values: HelpFormValues) => void;
  isNeedForm?: boolean;
  helpTitle: string;
  helpSubTitle?: string;
  helpDescriptionPlaceholder: string;
  buttonText: string;
  editValues?: HelpFormValues;
  isButtonDisabled?: boolean;
  deleteResolvedData?: {
    onResolvedDelete: ((isDelete?: boolean) => void) | undefined;
    isActive: boolean;
    isNeed: boolean;
  };
};

const HelpForm = ({
  onClose,
  handleSubmit,
  isNeedForm,
  helpTitle,
  helpSubTitle,
  helpDescriptionPlaceholder,
  buttonText,
  editValues,
  isButtonDisabled,
  deleteResolvedData
}: Props) => {
  const defaultValues = {
    title: '',
    description: '',
    hashtags: [],
    image: editValues?.image
  } as HelpFormValues;

  const [initialValues, setInitialValues] = useState<HelpFormValues>(defaultValues);
  const { t } = useTranslation('common');
  const isEdit = useMemo(() => !!editValues, [editValues]);

  useEffect(() => {
    if (editValues) {
      setInitialValues(editValues);
    }
  }, [editValues]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('validation_required')).max(50, t('validation_max_50')),
    description: Yup.string().required(t('validation_required')).max(400, t('validation_max_400')),
    hashtags: Yup.array().nullable().max(10, t('validation_max_60')),
    image: Yup.mixed<File>()
      .test('required', t('validation_required'), (value) => !!value)
      .test(
        'fileSize',
        t('validation_file_too_large'),
        (value) => value && (value.size <= FILE_SIZE || typeof value === 'string')
      )
      .test(
        'fileFormat',
        t('validation_file_unsupported'),
        (value) => value && (SUPPORTED_FORMATS.includes(value.type) || typeof value === 'string')
      )
  });

  return (
    <div className={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
        validateOnBlur>
        {({ values, errors, touched, setFieldTouched, setFieldValue }) => {
          return (
            <Form className={styles.form}>
              <div className={styles.imageWrapper}>
                <ImageUpload
                  placeholder={t('HelpForm_upload_photo_button_text')}
                  name="image"
                  title={t('HelpForm_upload_photo_title')}
                  subTitle={isNeedForm ? t('HelpForm_upload_photo_subTitle') : ''}
                  error={errors?.image}
                  touched={touched?.image}
                  setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                  selectedFile={isEdit ? editValues?.image : undefined}
                />
              </div>
              <div className={styles.secondColumn}>
                <label>
                  {helpTitle}&nbsp;
                  {helpSubTitle && <span className={styles.subLabel}>({helpSubTitle})</span>}
                  <FieldInput
                    styleWrapper={styles.fieldWrapper}
                    name="title"
                    placeholder={t('HelpForm_problem_title')}
                    error={errors?.title}
                    touched={touched?.title}
                  />
                </label>
                <label>
                  {t('HelpForm_description')}*&nbsp;
                  <span className={styles.subLabel}>{t('HelpForm_max_400_text')}</span>
                  <FieldInput
                    styleWrapper={styles.fieldWrapper}
                    as="textarea"
                    name="description"
                    placeholder={helpDescriptionPlaceholder}
                    error={errors?.description}
                    touched={touched?.description}
                  />
                </label>
                <div
                  className={classNames(
                    styles.fieldWrapper,
                    fieldStyles.container,
                    styles.tag_wrapper
                  )}>
                  <TagsInput
                    className={classNames(fieldStyles.input, styles.input)}
                    value={values.hashtags || []}
                    addOnBlur
                    onChange={(tags) => {
                      setFieldValue(
                        'hashtags',
                        tags.flatMap((item) =>
                          item
                            .replace(/[^\w\s]/gi, '')
                            .split(' ')
                            .filter((item) => !!item)
                        )
                      );
                    }}
                    addKeys={[9, 13, 32]}
                    addOnPaste
                    inputProps={{
                      className: classNames(styles.tag_input),
                      placeholder: t('HelpForm_problem_hashtags')
                    }}
                  />
                  {errors?.hashtags && touched && (
                    <p className={classNames(fieldStyles.error)}>{errors?.hashtags.toString()}</p>
                  )}
                </div>
                <div className={styles.buttons}>
                  {deleteResolvedData?.onResolvedDelete && (
                    <DeleteResolvedButtons
                      isActive={deleteResolvedData.isActive}
                      isNeed={deleteResolvedData.isNeed}
                      onResolvedDelete={deleteResolvedData.onResolvedDelete}
                    />
                  )}
                  <Button
                    buttonColor="whiteGreen"
                    text={t('HelpForm_cancel_button')}
                    style={styles.button}
                    onClick={onClose}
                  />
                  <Button
                    type="submit"
                    text={buttonText}
                    style={styles.button}
                    disabled={isButtonDisabled}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default HelpForm;
