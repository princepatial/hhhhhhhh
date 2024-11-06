import Image, { StaticImageData } from 'next/image';
import styles from './TopCaptionPhoto.module.scss';

type TopCaptionPhotoProps = {
  imgSrc: StaticImageData;
  atlImg: string;
  caption: string;
};

const TopCaptionPhoto = ({ imgSrc, atlImg, caption }: TopCaptionPhotoProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.betweenPhoto}>{caption}</span>
      <div className={styles.photo}>
        <Image src={imgSrc} alt={atlImg} />
      </div>
    </div>
  );
};

export default TopCaptionPhoto;
