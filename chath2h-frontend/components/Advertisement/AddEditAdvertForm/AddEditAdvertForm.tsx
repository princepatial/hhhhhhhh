import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import axios from 'axios';
import Button from 'components/Button';
import FieldInput from 'components/Inputs/FieldInput';
import ImageUpload from 'components/Inputs/ImageUpload';
import { Form, Formik } from 'formik';
import { AdvertFormValues, Advertisement as AdvertisementType } from 'globalTypes';
import { FILE_SIZE, SUPPORTED_FORMATS } from 'helpers';
import { useTranslation } from 'next-i18next';
import 'react-tagsinput/react-tagsinput.css';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import styles from './AddEditAdvertForm.module.scss';

type Props = {
  onClose: () => void;
  editValues?: AdvertisementType | null;
  location: string;
  isNiKU?: boolean;
  refetchAds: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<AdvertisementType[] | null, unknown>>;
};

const AddEditAdvertForm = ({
  onClose,
  editValues,
  location,
  isNiKU = false,
  refetchAds
}: Props) => {
  const defaultValues = {
    name: editValues?.name || '',
    redirectPath: editValues?.redirectPath || '',
    image: editValues?.imageSrc
  } as AdvertFormValues;

  const { t } = useTranslation('common');
  const isEdit = !!editValues;

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .test('required', t('validation_required'), (value) => (isNiKU ? true : !!value))
      .max(50, t('validation_max_50')),
    redirectPath: Yup.string().required(t('validation_required')),
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

  const handleSubmit = async (values: AdvertFormValues) => {
    try {
      const requestData = {
        adImage: typeof values.image === 'string' ? undefined : values.image,
        name: isNiKU ? 'niku' : values.name,
        redirectPath: values.redirectPath
      };

      if (isEdit) {
        const editRequestData = {
          ...requestData,
          id: editValues._id
        };

        await axios.patch('/advertisement', editRequestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('AddEditAdvertForm_edit_success'));
        refetchAds();
      } else {
        const addRequestData = {
          ...requestData,
          location
        };

        await axios.post('/advertisement', addRequestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('AddEditAdvertForm_add_success'));
        refetchAds();
      }
    } catch (err) {
      console.log(isEdit ? t('AddEditAdvertForm_edit_error') : t('AddEditAdvertForm_add_error'));
    } finally {
      onClose();
    }
  };

  return (
    <div className={styles.container}>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
        validateOnBlur>
        {({ errors, touched, setFieldTouched, setFieldValue }) => {
          return (
            <Form className={styles.form}>
              <ImageUpload
                name="image"
                title={t('AddEditAdvertForm_advert_image')}
                error={typeof errors?.image === 'string' ? errors?.image : undefined}
                touched={typeof touched?.image === 'boolean' ? touched?.image : undefined}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                selectedFile={isEdit ? editValues?.imageSrc : undefined}
              />
              <div className={styles.secondColumnWrapper}>
                <div className={styles.secondColumn}>
                  {!isNiKU && (
                    <label>
                      {t('AddEditAdvertForm_name')}
                      <FieldInput
                        styleWrapper={styles.fieldWrapper}
                        name="name"
                        placeholder={t('AddEditAdvertForm_placeholder_name')}
                        error={errors?.name}
                        touched={touched?.name}
                      />
                    </label>
                  )}
                  <label>
                    {t('AddEditAdvertForm_redirect_path')}
                    <FieldInput
                      styleWrapper={styles.fieldWrapper}
                      name="redirectPath"
                      placeholder={t('AddEditAdvertForm_redirect_path')}
                      error={errors?.redirectPath}
                      touched={touched?.redirectPath}
                    />
                  </label>
                </div>
                <div className={styles.buttons}>
                  <Button
                    buttonColor="whiteGreen"
                    text={t('AddEditAdvertForm_cancel_button')}
                    style={styles.button}
                    onClick={onClose}
                  />
                  <Button
                    type="submit"
                    text={t('AddEditAdvertForm_confirm_button')}
                    style={styles.button}
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

export default AddEditAdvertForm;
