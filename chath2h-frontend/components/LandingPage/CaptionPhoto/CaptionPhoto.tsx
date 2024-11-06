import arrowImg from '@images/arrow_down.svg';
import classNames from 'classnames';
import Button from 'components/Button';
import Image, { StaticImageData } from 'next/image';
import { MouseEventHandler, ReactElement } from 'react';
import styles from './CaptionPhoto.module.scss';
import { bool } from 'yup';
import { useTranslation } from 'next-i18next';

type CaptionPhotoProps = {
  children: JSX.Element;
  photoText?: JSX.Element | string;
  counterText?: string;
  secondLine?: JSX.Element | string;
  leftImg?: StaticImageData;
  rightImg?: StaticImageData;
  imgLink?: StaticImageData;
  altImg?: string;
  videoLink?: string;
  textBackgroundCover?: boolean;
  textBackground: string;
  buttonText?: string;
  onButtonClick?: MouseEventHandler;
  customButtonStyles?: string;
  textPhotoStyles?: string;
  noScrollIndicator?: boolean;
  bottomVideo?: ReactElement;
  leftImageClass?: string;
  rightImageClass?: string;
  isPriority?: boolean;
};

const CaptionPhoto = ({
  children,
  photoText,
  counterText,
  secondLine,
  leftImg,
  rightImg,
  imgLink,
  altImg,
  videoLink,
  textBackground,
  buttonText,
  onButtonClick,
  customButtonStyles,
  noScrollIndicator,
  textPhotoStyles,
  bottomVideo,
  leftImageClass,
  rightImageClass,
  isPriority
}: CaptionPhotoProps) => {
  const { t } = useTranslation('common');
  return (
    <div className={styles.container}>
      <div className={styles.photo}>
        {imgLink && (
          <Image
            className={styles.background}
            style={{ objectFit: 'cover' }}
            alt={altImg || ''}
            src={imgLink}
            priority={isPriority || false}
          />
        )}
        {videoLink && <video playsInline src={videoLink} autoPlay loop muted />}
        {!noScrollIndicator && (
          <div className={styles.arrow}>
            <Image alt="arrow" src={arrowImg} priority={isPriority || false} />
          </div>
        )}
        {photoText && (
          <span
            className={classNames(
              styles.photoText,
              textPhotoStyles || styles.photoText__defaultPosition
            )}>
            {photoText}
          </span>
        )}
      </div>
      <div className={classNames(styles.captionPhoto, textBackground)}>
        <div className={classNames(styles.wrapper, !leftImg && !rightImg && styles.always_center)}>
          {(rightImg || leftImg) && (
            <div className={styles.leftImg}>
              {leftImg && <Image src={leftImg} className={leftImageClass} alt="left image" />}
            </div>
          )}
          <div className={styles.footer}>
            <div className={styles.text}>
              <div>{children}</div>
              {(counterText || secondLine) && (
                <div className={styles.secondLine}>
                  <span className={styles.counter}>{counterText}</span>
                  {secondLine}
                </div>
              )}
            </div>
            {bottomVideo}
          </div>
          {(rightImg || leftImg) && (
            <div className={styles.rightImg}>
              {rightImg && <Image src={rightImg} className={rightImageClass} alt="right image" />}
            </div>
          )}
        </div>
        {buttonText && (
          <div className={styles.actions_wrapper}>
            <div className={styles.action}>
              <span className={styles.buttonDesc}>{t('index_become_join_text')}</span>
              <Button
                buttonColor="green"
                text={buttonText}
                style={classNames(styles.button, customButtonStyles || '')}
                onClick={onButtonClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionPhoto;
