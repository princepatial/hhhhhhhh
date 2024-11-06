import styles from './DashboardMyWork.module.scss';
import { Need, Offer } from 'globalTypes';
import classNames from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';

type Props = {
  isNeed?: boolean;
  items: Offer[] | Need[];
};

const makeTitleLinkTextLink = (isNeed: boolean) => {
  const { t } = useTranslation('common');

  const isNeedAndSuggested = {
    title: t('Dashboard_My_Work_my_needs_text'),
    linkText: t('Dashboard_My_Work_my_needs_link'),
    empty: t('Dashboard_My_Work_my_needs_empty'),
    link: '/dashboard/my-work',
    alt: 'my-needs-image-'
  };

  const isOfferAndSuggested = {
    title: t('Dashboard_My_Work_my_offers_text'),
    linkText: t('Dashboard_My_Work_my_offers_link'),
    empty: t('Dashboard_My_Work_my_offers_empty'),
    link: '/dashboard/my-work#offers',
    alt: 'my-offer-image-'
  };

  return isNeed ? isNeedAndSuggested : isOfferAndSuggested;
};

const DashboardMyWork = ({ isNeed = false, items }: Props) => {
  const { t } = useTranslation('common');
  const { title: sectionTittle, linkText, link, empty } = makeTitleLinkTextLink(isNeed);
  return (
    <div className={styles.container}>
      <div className={styles.topText}>
        <span className={classNames(styles.title)}>{sectionTittle}</span>
        <Link className={classNames(styles.linkText)} href={link}>
          {linkText}
        </Link>
      </div>
      {items && items.length > 0 ? (
        <div className={styles.itemsRow}>
          <div className={styles.row}>
            {items.map((item) => {
              const { area, problemTitle } = item;
              return (
                <div key={`${item._id}-${problemTitle}`}>
                  <span
                    className={classNames(
                      styles.category,
                      isNeed ? styles.colorRed : styles.colorGreen
                    )}>
                    {t(area.name)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.row}>
            {items.map((item, index) => {
              const { problemTitle } = item;
              const imageSrc = useImageUrl(
                'image' in item ? item.image.filename : item.representativePhoto.filename
              );
              return (
                <div className={styles.imageBox}>
                  <div className={styles.image}>
                    <Image
                      src={imageSrc}
                      fill
                      className={classNames(
                        styles.image,
                        isNeed ? styles.imageRed : styles.imageGreen
                      )}
                      alt={index ? index + '-coachDetails' : 'coachDetails'}
                    />
                  </div>
                  <span className={styles.title}>{problemTitle}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.itemsRow}>{empty}</div>
      )}
    </div>
  );
};

export default DashboardMyWork;
