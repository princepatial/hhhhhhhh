import Avatar from '@images/avatarMountains.png';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image, { StaticImageData } from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import FiledInputFile from '../FiledInputFile';
import styles from './ImageUpload.module.scss';

// Schema validation image for formik

// image: Yup.mixed<File>()
// .test('fileSize', 'file too large', (value) => value && value.size <= FILE_SIZE)
// .test(
//   'fileFormat',
//   'unsupported Format',
//   (value) => value && SUPPORTED_FORMATS.includes(value.type)
// ),

type SetFieldValue<ValueType = any> = (
  field: string,
  value: ValueType,
  shouldValidate?: boolean
) => void;
type SetFieldTouched = (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;

type Props = {
  name: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  setFieldTouched: SetFieldTouched;
  setFieldValue: SetFieldValue;
  title: string;
  subTitle?: string;
  isCircleImage?: boolean;
  selectedFile?: string | File;
  backgroundImg?: StaticImageData;
  imgWidth?: string;
  imgSize?: number;
};

const ImageUpload = ({
  error,
  touched,
  setFieldTouched,
  setFieldValue,
  placeholder,
  name,
  title,
  subTitle,
  isCircleImage,
  selectedFile,
  backgroundImg = Avatar,
  imgSize
}: Props) => {
  const [selectedImage, setSelectedImage] = useState<string | null>();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!selectedImage) {
      if (selectedFile instanceof File) {
        selectedFile = URL.createObjectURL(selectedFile);
      } else {
        setSelectedImage(selectedFile);
      }
      setFieldValue(name, selectedFile);
    }
  }, [selectedFile, selectedImage]);

  const imgStyles = { width: imgSize, height: imgSize };

  return (
    <div className={styles.container}>
      <label htmlFor="image" className={styles.title} style={{ width: imgSize }}>
        {title}
      </label>
      {subTitle && (
        <span
          className={classNames(styles.subTitle, isCircleImage && styles.marginCircleAvatar)}
          style={{ width: imgSize }}>
          {subTitle}
        </span>
      )}
      <div className={classNames(styles.action, isCircleImage && styles.actionCircle)}>
        <label htmlFor={name} className={styles.pointer}>
          {selectedImage ? (
            <div
              className={classNames(styles.image, isCircleImage && styles.circleImage)}
              style={imgStyles}>
              <Image
                src={selectedImage}
                alt="avatar-image"
                fill
                style={{ objectFit: 'cover' }}></Image>
            </div>
          ) : (
            <div
              className={classNames(styles.image, isCircleImage && styles.circleImage)}
              style={imgStyles}>
              <Image src={backgroundImg} alt="avatar-image" width={36} height={36}></Image>
            </div>
          )}
        </label>
        <div className={styles.buttonSection} style={{ width: imgSize }}>
          <FiledInputFile
            name={name}
            placeholder={placeholder || t('ImageUpload_button')}
            error={error}
            touched={touched}
            accept={'image/png, image/jpeg'}
            styleInput={styles.styleInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (!e.currentTarget.files) return;
              setFieldTouched(name);
              const file = e.currentTarget.files[0];
              if (file) {
                setFieldValue(name, file);
                setSelectedImage(URL.createObjectURL(file));
              }
            }}
          />
          <span className={styles.uploadText}>{t('ImageUpload_max_file_size')}5MB</span>
        </div>
      </div>
    </div>
  );
};
export default ImageUpload;
