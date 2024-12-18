import avatar from '@images/Avatar.png';
import axios, { AxiosRequestConfig } from 'axios';
import classNames from 'classnames';
import Button from 'components/Button';
import FieldInput from 'components/Inputs/FieldInput';
import ImageUpload from 'components/Inputs/ImageUpload';
import { languages } from 'countries-list';
import { Field, Form, Formik } from 'formik';
import { setGlobalState, useGlobalState } from 'globalState';
import {
  SelectOptions,
  educationNamesTranslate,
  gendersTranslate,
  maritalStatusTranslate,
  professionalActivityTranslate
} from 'globalTypes';
import {
  FILE_SIZE,
  SUPPORTED_FORMATS,
  getLanguageOptions,
  getSelectOptions,
  handleSelectChange
} from 'helpers';
import useImageUrl from 'hooks/getImageUrl';
import { useLoadingTracker } from 'hooks/useLoadingTracker';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import SelectComponent, { StylesConfig } from 'react-select';
import countryList from 'react-select-country-list';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import styles from './Register.module.scss';
import { RegisterFormType } from './RegisterTypes';
import Link from 'next/link';

type Props = {
  isEdit?: boolean;
  handleCancel: () => void;
};

interface RequestParams {
  token?: string;
  refToken?: string;
}


type IsMulti = boolean;

const customStylesSelect: StylesConfig<SelectOptions, IsMulti> = {
  container: () => ({
    height: '100%',
    position: 'relative'
  }),
  control: () => ({
    padding: '2px 0 0 14px',
    border: '1px solid #e8e8e8',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    minHeight: '40px',
    borderRadius: '4px',
    background: '#fff',
    fontSize: '14px',
    justifyContent: 'space-between'
  }),
  indicatorSeparator: () => ({
    width: 0
  }),
  input: () => ({
    position: 'absolute'
  }),
  valueContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  }),
  singleValue: () => ({
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontWeight: '300'
  }),
  clearIndicator: () => ({
    display: 'none'
  }),
  multiValue: (base) => ({
    justifyContent: 'space-between',
    ...base
  }),
  multiValueLabel: () => ({
    display: 'flex',
    flexWrap: 'wrap'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#39aba4',
    padding: '4px'
  }),
  menu: () => ({
    background: '#f9f9f9',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    fontSize: '12px'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#39aba4' : '#f9f9f9',
    '&:hover': {
      backgroundColor: '#39aba4'
    }
  })
};

const RegisterForm = ({ isEdit, handleCancel }: Props) => {
  const router = useRouter();
  const refToken = router.query.refToken as string;
  const [selectedImage, setSelectedImage] = useState<string>();
  const [user] = useGlobalState('user');
  const { t } = useTranslation('common');
  const { isLoading, ltrack } = useLoadingTracker();
  const [uiLanguage] = useGlobalState('language');
  const [token, setToken] = useState<string | null>(null);



   // Initialize form values
 const defaultValues: RegisterFormType = {
  firstName: '',
  lastName: '',
  gender: undefined,
  age: undefined,
  language: [],
  country: undefined,
  city: '',
  avatar: undefined,
  education: undefined,
  maritalStatus: undefined,
  occupation: '',
  professionalActivity: '',
  email: '',
  walletAddress: '',
  privacyPolicy: false
};
const [initialValues, setInitialValues] = useState<RegisterFormType>(defaultValues);
  const configGetOptions = { t };
  const countryOptions = useMemo(() => countryList().getData(), []);
  const languageOptions = useMemo(() => getLanguageOptions(languages), []);

  const genderOptions: SelectOptions[] = useMemo(
    () => getSelectOptions(gendersTranslate, configGetOptions),
    [t]
  );

  const educationOptions: SelectOptions[] = useMemo(
    () => getSelectOptions(educationNamesTranslate, configGetOptions),
    [t]
  );

  const maritalStatusOptions: SelectOptions[] = useMemo(
    () => getSelectOptions(maritalStatusTranslate, configGetOptions),
    [t]
  );

  const professionalActivityOptions: SelectOptions[] = useMemo(
    () => getSelectOptions(professionalActivityTranslate, configGetOptions),
    [t]
  );

    // Load user data for edit mode
    useEffect(() => {
      if (isEdit && user) {
        const imageSrc = useImageUrl(user.avatar?.filename);
        setSelectedImage(imageSrc);
  
        const transformedUserData = {
  firstName: user.firstName,
  lastName: user.lastName,
  gender: genderOptions.find((option) => option.value === user.gender),
  age: user.age,
  language: languageOptions.filter((option) => {
    if (Array.isArray(user.language)) {
      return user.language.includes(option.value as string);
    }
    if (typeof user.language === 'string') {
      return user.language === option.value;
    }
    return false;
  }),
          country: countryOptions.find((option) => option.value === user.country),
          city: user.city,
          avatar: undefined,
          education: educationOptions.find((option) => option.value === user.education),
          maritalStatus: maritalStatusOptions.find(
            (option) => option.value === user.maritalStatus
          ),
          occupation: user.occupation,
          professionalActivity: user.professionalActivity,
          walletAddress: user.walletAddress
        };
  
        setInitialValues(transformedUserData);
      }
    }, [isEdit, user]);
  

 // Form validation schema
 const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(t('validation_email'))
    .test('required', t('Register_required'), (value) => (refToken ? !!value : true)),
  firstName: Yup.string().required(t('Register_required')),
  lastName: Yup.string(),
  gender: Yup.object().required(t('Register_required')),
  age: Yup.number()
    .typeError(t('Register_number_error'))
    .required(t('Register_required'))
    .positive()
    .integer(),
  language: Yup.array()
    .required(t('Register_required'))
    .max(5, t('Register_max_5_lang'))
    .min(1, t('Register_required')),
  country: Yup.object().required(t('Register_required')),
  city: Yup.string().required(t('Register_required')),
  avatar: Yup.mixed<File>()
    .test('required', t('Register_required'), (value) => (isEdit ? true : !!value))
    .test('fileSize', t('Register_file_too_large'), (value) => 
      isEdit ? true : value && value.size <= 5 * 1024 * 1024) // 5MB limit
    .test('fileFormat', t('Register_unsupported_format'), (value) =>
      isEdit ? true : value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    ),
  education: Yup.object().required(t('Register_required')),
  maritalStatus: Yup.object(),
  occupation: Yup.string(),
  professionalActivity: Yup.string(),
  privacyPolicy: Yup.bool().oneOf([true], t('Register_required'))
});



  useEffect(() => {
    // Get token from URL when component mounts
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    setToken(tokenFromUrl);
    
    if (!tokenFromUrl) {
      console.error('No token found in URL');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
  }, []);

   // Handle form submission
 // Handle form submission

 const handleSubmit = async (values: RegisterFormType) => {
  try {
    if (!token && !refToken) {
      toast.error(t('Register_token_required'));
      return;
    }

    const formData = new FormData();

    // Transform values with proper type safety
    const transformedValues = {
      firstName: values.firstName,
      lastName: values.lastName || '',
      gender: values.gender?.value || '',
      country: values.country?.value || '',
      age: values.age?.toString() || '',
      // Ensure language is always an array of strings
      language: values.language?.map(lang => String(lang.value)) || [],
      city: values.city,
      education: values.education?.value || '',
      maritalStatus: values.maritalStatus?.value,
      occupation: values.occupation || '',
      professionalActivity: values.professionalActivity || '',
      email: values.email || '',
      walletAddress: values.walletAddress || '',
      privacyPolicy: values.privacyPolicy ? 'true' : 'false'
    };

    // Handle language array with type safety
    if (transformedValues.language.length > 0) {
      transformedValues.language.forEach((lang, index) => {
        if (lang) {
          formData.append(`language[${index}]`, lang);
        }
      });
    } else {
      formData.append('language[]', '');
    }

    // Safely append other values to FormData
    Object.entries(transformedValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'language') {
        // Convert all values to string before appending
        formData.append(key, String(value));
      }
    });

    // Safely append avatar if present
    if (values.avatar instanceof File) {
      formData.append('avatar', values.avatar);
    }

    // Make API request
    const endpoint = refToken ? '/register/referral' : '/register';
    const queryParam = refToken ? `refToken=${refToken}` : `token=${token}`;
    
    const response = await axios.post(
      `http://localhost:3001/api${endpoint}?${queryParam}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data) {
      setGlobalState('user', response.data);
      setGlobalState('isUserLogged', true);
      toast.success(t('Register_user_added'));
      router.push(`/${uiLanguage.value}/dashboard`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || t('Register_error_register');
      toast.error(errorMessage);
    } else {
      toast.error(t('Register_error_register'));
    }
  }
};

  const fileInputName = 'avatar';
  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ errors, touched, values, setFieldValue, setFieldTouched }) => {
          return (
            <Form className={styles.container}>
              <div className={styles.form}>
                <div className={styles.textInputsWrapper}>
                  {refToken && (
                    <label className={styles.label}>
                      <span className={styles.labelRequired}>{t('Register_email')}</span>
                      <FieldInput
                        name="email"
                        placeholder={t('Register_email')}
                        error={errors?.email}
                        type="text"
                        touched={touched?.email}
                        styleInput={styles.input}
                        styleWrapper={styles.inputWrapper}
                      />
                    </label>
                  )}
                  <label className={styles.label}>
                    <span className={styles.labelRequired}>{t('Register_name')}</span>
                    <div className={styles.names}>
                      <FieldInput
                        name="firstName"
                        placeholder={t('Register_name')}
                        error={errors?.firstName}
                        type="text"
                        touched={touched?.firstName}
                        styleInput={styles.input}
                        styleWrapper={styles.inputWrapper}
                      />
                      <FieldInput
                        name="lastName"
                        placeholder={t('Register_last')}
                        error={errors?.lastName}
                        type="text"
                        touched={touched?.lastName}
                        styleInput={styles.input}
                        styleWrapper={styles.inputWrapper}
                      />
                    </div>
                  </label>
                  <label className={styles.label}>
                    <span className={styles.labelRequired}>{t('Register_country')}</span>
                    <SelectComponent
                      placeholder={t('Register_choose_country')}
                      aria-labelledby="country"
                      value={values.country}
                      onBlur={() => setFieldTouched('country')}
                      onChange={(value) => handleSelectChange('country', value, setFieldValue)}
                      options={countryOptions}
                      classNamePrefix={'Select'}
                      styles={customStylesSelect}
                    />
                    {errors?.country && touched.country && (
                      <p className={styles.error}>{errors.country}</p>
                    )}
                  </label>
                  <div className={styles.labelsFlex}>
                    <label className={styles.label}>
                      <span className={styles.labelRequired}>{t('Register_city')}</span>
                      <FieldInput
                        name="city"
                        placeholder={t('Register_where_live')}
                        error={errors?.city}
                        type="text"
                        touched={touched.city}
                        styleInput={styles.input}
                        styleWrapper={styles.inputWrapper}
                      />
                    </label>

                    <label className={styles.label}>
                      <span className={styles.labelRequired}>{t('Register_age')}</span>
                      <FieldInput
                        name={'age'}
                        placeholder={t('Register_age')}
                        error={errors?.age}
                        type="number"
                        touched={touched?.age}
                        styleInput={styles.input}
                        styleWrapper={styles.inputWrapper}
                      />
                    </label>
                  </div>
                  <div className={styles.selectFlex}>
                    <label className={styles.label}>
                      <span className={styles.labelRequired}>{t('Register_language')}</span>
                      <SelectComponent
                        placeholder={t('Register_language')}
                        isMulti
                        aria-labelledby="language"
                        value={values.language}
                        onBlur={() => setFieldTouched('language')}
                        onChange={(value) => {
                          if (value && Array.isArray(value) && value.length > 6) return;

                          return handleSelectChange('language', value, setFieldValue);
                        }}
                        options={languageOptions}
                        classNamePrefix="Select"
                        styles={customStylesSelect}
                      />
                      {errors?.language && touched.language && (
                        <p className={styles.error}>{errors.language}</p>
                      )}
                    </label>
                    <label className={styles.label}>
                      <span className={styles.labelRequired}>{t('Register_gender')}</span>
                      <SelectComponent
                        placeholder={t('Register_gender')}
                        aria-labelledby="gender"
                        value={values.gender}
                        onBlur={() => setFieldTouched('gender')}
                        onChange={(value) => handleSelectChange('gender', value, setFieldValue)}
                        options={genderOptions}
                        classNamePrefix="Select"
                        styles={customStylesSelect}
                      />
                      {errors?.gender && touched.gender && (
                        <p className={styles.error}>{errors.gender}</p>
                      )}
                    </label>
                  </div>
                  <label className={styles.label}>
                    <span> {t('Register_marital_status')}</span>
                    <SelectComponent
                      placeholder={t('Register_choose')}
                      aria-labelledby="maritalStatus"
                      value={values.maritalStatus}
                      onBlur={() => setFieldTouched('maritalStatus')}
                      onChange={(value) =>
                        handleSelectChange('maritalStatus', value, setFieldValue)
                      }
                      options={maritalStatusOptions}
                      classNamePrefix="Select"
                      styles={customStylesSelect}
                    />
                    {errors?.maritalStatus && touched.maritalStatus && (
                      <p className={styles.error}>{errors.maritalStatus}</p>
                    )}
                  </label>
                  <label className={styles.label}>
                    <span className={styles.labelRequired}>{t('Register_education')}</span>
                    <SelectComponent
                      placeholder={t('Register_choose')}
                      aria-labelledby="education"
                      value={values.education}
                      onBlur={() => setFieldTouched('education')}
                      onChange={(value) => handleSelectChange('education', value, setFieldValue)}
                      options={educationOptions}
                      classNamePrefix="Select"
                      styles={customStylesSelect}
                    />
                    {errors?.education && touched.education && (
                      <p className={styles.error}>{errors.education}</p>
                    )}
                  </label>
                  <label className={styles.label}>
                    <span>{t('Register_occupation')}</span>
                    <FieldInput
                      name={'occupation'}
                      placeholder={t('Register_occupation')}
                      error={errors?.occupation}
                      type={'string'}
                      touched={touched?.occupation}
                      styleInput={styles.input}
                      styleWrapper={styles.inputWrapper}
                    />
                  </label>
                  <label className={styles.label}>
                    <span>{t('Register_wallet_address')}</span>
                    <FieldInput
                      name="walletAddress"
                      placeholder={t('Register_wallet_address')}
                      error={errors?.walletAddress}
                      type="text"
                      touched={touched?.walletAddress}
                      styleInput={styles.input}
                      styleWrapper={styles.inputWrapper}
                    />
                  </label>
                  <label className={styles.required}>{t('Register_required')}</label>
                  {!user && (
                    <div className={styles.box}>
                      <label
                        className={classNames(
                          styles.label,
                          styles.inputRadioCheckbox,
                          styles.checkbox
                        )}>
                        <Field
                          type="checkbox"
                          name="privacyPolicy"
                          error={errors?.privacyPolicy}
                          touched={touched.privacyPolicy}
                        />
                        <span className={styles.text}>
                          {t('Register_privacy-policy_accept1')}&nbsp;
                          <Link className={styles.color} href="/privacy-policy" target="_blank">
                            {t('Register_privacy-policy_accept2')}
                          </Link>
                        </span>
                      </label>
                      {errors?.privacyPolicy && touched.privacyPolicy && (
                        <p className={styles.error}>{errors.privacyPolicy}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className={styles.firstBoxWrapper}>
                  <span className={styles.topText}>{t('Register_please_fill')}</span>
                  <div className={styles.imageRadio}>
                    <div className={styles.imageWrapper}>
                      <ImageUpload
                        name={fileInputName}
                        title={t('Register_avatar')}
                        error={errors?.[fileInputName]}
                        touched={touched?.[fileInputName]}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        isCircleImage
                        selectedFile={isEdit ? selectedImage : undefined}
                        backgroundImg={avatar}
                        imgSize={136}
                      />
                    </div>
                    <div className={styles.radioButtons} aria-labelledby="professionalActivityArea">
                      <label className={styles.label}>{t('Register_pro_activity')}</label>
                      <div className={styles.radioCheckBoxes}>
                        {professionalActivityOptions.map((item, index) => {
                          return (
                            <label
                              key={index}
                              className={classNames(
                                styles.label,
                                styles.radioButtonWrapper,
                                styles.inputRadioCheckbox
                              )}>
                              <Field
                                type="radio"
                                name="professionalActivity"
                                value={item.value}></Field>
                              <span>
                                {item?.label && item.label.toString().toLocaleLowerCase()}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttonWrapper}>
                <Button
                  style={styles.button}
                  buttonColor="whiteGreen"
                  onClick={handleCancel}
                  text={t('Register_cancel')}></Button>
                <Button
                  disabled={isLoading}
                  style={styles.button}
                  text={isEdit ? t('Register_save') : t('Register_register')}
                  type={'submit'}></Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default RegisterForm;
