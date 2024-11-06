import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import axios from 'axios';
import Button from 'components/Button';
import FieldInput from 'components/Inputs/FieldInput';
import ImageUpload from 'components/Inputs/ImageUpload';
import { Form, Formik } from 'formik';
import { AdvertFormValues, AreaResponse } from 'globalTypes';
import { FILE_SIZE, SUPPORTED_FORMATS } from 'helpers';
import { useTranslation } from 'next-i18next';
import 'react-tagsinput/react-tagsinput.css';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import styles from './AddEditCategoryForm.module.scss';
import { useLoadingTracker } from 'hooks/useLoadingTracker';

type Props = {
  onClose: () => void;
  editValues?: AreaResponse | null;
  onAddNewCategory: (newArea: AreaResponse) => void;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<AreaResponse[], unknown>>;
};

const AddEditCategoryForm = ({ onClose, editValues, onAddNewCategory, refetch }: Props) => {
  const defaultValues = {
    name: editValues?.name || '',
    image: editValues?.imageSrc
  } as AdvertFormValues;

  const { isLoading, ltrack } = useLoadingTracker();
  const { t } = useTranslation('common');
  const isEdit = !!editValues;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('validation_required')).max(50, t('validation_max_50')),
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

  const handleSubmit = ltrack(async (values: AdvertFormValues) => {
    try {
      const requestData = {
        image: typeof values.image === 'string' ? undefined : values.image,
        name: values.name.toLowerCase(),
        redirectPath: values.redirectPath
      };

      if (isEdit) {
        const editRequestData = {
          ...requestData,
          id: editValues._id
        };

        const response = await axios.patch('/areas', editRequestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.status === 200) {
          toast.success(t('AddEditCategoryForm_edit_success'));
          refetch();
        }
      } else {
        const response = await axios.post('/areas', requestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.status === 201) {
          toast.success(t('AddEditCategoryForm_add_success'));
          onAddNewCategory({ ...response.data, areaImage: response.data.filename });
        }
      }
    } catch (err) {
      console.log(
        isEdit ? t('AddEditCategoryForm_edit_error') : t('AddEditCategoryForm_add_error')
      );
    } finally {
      onClose();
    }
  });

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
                title={t('AddEditCategoryForm_category_image')}
                error={typeof errors?.image === 'string' ? errors.image : undefined}
                touched={typeof touched?.image === 'boolean' ? touched.image : undefined}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                selectedFile={isEdit ? editValues?.imageSrc : undefined}
              />
              <div className={styles.secondColumnWrapper}>
                <div className={styles.secondColumn}>
                  <label>
                    {t('AddEditCategoryForm_name')}
                    <FieldInput
                      styleWrapper={styles.fieldWrapper}
                      name="name"
                      placeholder={t('AddEditCategoryForm_placeholder_name')}
                      error={errors?.name}
                      touched={touched?.name}
                    />
                  </label>
                </div>
                <div className={styles.buttons}>
                  <Button
                    buttonColor="whiteGreen"
                    text={t('AddEditCategoryForm_cancel_button')}
                    style={styles.button}
                    onClick={onClose}
                  />
                  <Button
                    type="submit"
                    text={t('AddEditCategoryForm_confirm_button')}
                    style={styles.button}
                    disabled={isLoading}
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

export default AddEditCategoryForm;
