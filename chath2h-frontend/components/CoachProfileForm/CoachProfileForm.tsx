import axios from 'axios';
import Button from 'components/Button';
import FieldInput from 'components/Inputs/FieldInput';
import ImageUpload from 'components/Inputs/ImageUpload';
import { Form, Formik } from 'formik';
import { setGlobalState, useGlobalState } from 'globalState';
import { FILE_SIZE, SUPPORTED_FORMATS } from 'helpers';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import styles from './CoachProfileForm.module.scss';
import { useEffect, useState } from 'react';
import { Photo } from 'globalTypes';
import { useTranslation } from 'next-i18next';
import useImageUrl from 'hooks/getImageUrl';
import classNames from 'classnames';
import { useLoadingTracker } from 'hooks/useLoadingTracker';

type Props = {
  isEdit?: boolean;
  handleCancel: () => void;
};

const defaultValues = {
  coachPhoto: undefined,
  coachCompetence: '',
  about: ''
};
export type CoachProfileForm = {
  coachPhoto: Photo | undefined;
  coachCompetence: string;
  about: string;
};

const CoachProfileForm = ({ isEdit, handleCancel }: Props) => {
  const [initialValues, setInitialValues] = useState<CoachProfileForm>(defaultValues);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [user, setUser] = useGlobalState('user');
  const { t } = useTranslation('common');

  useEffect(() => {
    if (isEdit && user) {
      const { about, coachCompetence, coachPhoto } = user?.coachProfile;
      const imageSrc = coachPhoto?.filename && useImageUrl(coachPhoto.filename);
      setSelectedImage(imageSrc);
      const newCoach = { about, coachCompetence, coachPhoto: undefined };
      setInitialValues(newCoach);
    }
  }, [isEdit, user]);

  const validationSchema = Yup.object().shape({
    about: Yup.string()
      .required(t('CoachProfileForm_required'))
      .max(50, t('CoachProfileForm_max_50_char')),
    coachCompetence: Yup.string()
      .required(t('CoachProfileForm_required'))
      .max(550, t('CoachProfileForm_max_550_char')),
    coachPhoto: Yup.mixed<File>()
      .test('fileSize', t('CoachProfileForm_file_too_large'), (value) =>
        value ? value.size <= FILE_SIZE : true
      )
      .test('fileFormat', t('CoachProfileForm_unsupported_format'), (value) =>
        value ? SUPPORTED_FORMATS.includes(value.type) : true
      )
  });
  const { isLoading, ltrack } = useLoadingTracker();
  const handleSubmit = ltrack(async (values: CoachProfileForm) => {
    if (isLoading) return;
    try {
      const reqValues = {
        ...values
      };

      const reqEditValues = {
        coachProfile: { about: values.about, coachCompetence: values.coachCompetence },
        coachPhoto: values.coachPhoto
      };

      const reqHeaders = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      const coachProfileResponse = isEdit
        ? await axios.patch('/users', reqEditValues, reqHeaders)
        : await axios.post('/coaches/coachProfile', reqValues, reqHeaders);

      if (coachProfileResponse) {
        setGlobalState('isCoachProfile', true);

        if (!isEdit) {
          toast.success(t('CoachProfileForm_you_are_coach'));
          handleCancel();
        } else {
          toast.success(t('CoachProfileForm_edited'));
        }
        setUser((prev) => {
          if (prev) {
            return { ...prev, coachProfile: coachProfileResponse.data.coachProfile };
          } else {
            return null;
          }
        });
      } else {
        throw Error();
      }
    } catch (error) {
      console.log(t('CoachProfileForm_error_submit'), error);
    }
  });

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ errors, touched, setFieldValue, setFieldTouched }) => {
        return (
          <Form className={styles.container}>
            <div className={styles.formData}>
              <div>
                <ImageUpload
                  name="coachPhoto"
                  title={t('CoachProfileForm_your_photo')}
                  subTitle={t('CoachProfileForm_real_photo')}
                  error={errors?.coachPhoto}
                  touched={touched?.coachPhoto}
                  placeholder={t('CoachProfileForm_upload_photo')}
                  setFieldTouched={setFieldTouched}
                  setFieldValue={setFieldValue}
                  isCircleImage
                  selectedFile={isEdit ? selectedImage : undefined}
                  imgSize={isEdit ? 136 : undefined}
                />
              </div>
              <div className={styles.inputs}>
                <label>
                  {t('CoachProfileForm_describe_yourself')}
                  <span>({t('CoachProfileForm_max_50_char')})</span>
                  <FieldInput
                    type="text"
                    name="about"
                    as="textarea"
                    error={errors?.about}
                    touched={touched?.about}
                    styleWrapper={styles.inputWrapper}
                    styleInput={styles.input}
                    placeholder={t('CoachProfileForm_few_words')}
                  />
                </label>

                <label>
                  {t('CoachProfileForm_why_coach')}
                  <span>({t('CoachProfileForm_max_550_char')})</span>
                  <FieldInput
                    type="text"
                    name="coachCompetence"
                    as="textarea"
                    error={errors?.coachCompetence}
                    touched={touched?.coachCompetence}
                    styleWrapper={styles.inputWrapper}
                    styleInput={classNames(styles.input, styles.inputLarge)}
                    placeholder={t('CoachProfileForm_describe_how_can_help')}
                  />
                </label>
                <div className={styles.buttons}>
                  <Button
                    buttonColor="whiteGreen"
                    text={t('CoachProfileForm_cancel')}
                    style={styles.button}
                    onClick={() => handleCancel()}
                  />
                  <Button
                    text={t('CoachProfileForm_save')}
                    type="submit"
                    style={styles.button}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CoachProfileForm;
