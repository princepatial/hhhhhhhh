import styles from './DashboardSuggested.module.scss';
import { Need, Offer, needOfferPath } from 'globalTypes';
import classNames from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';
import { Router, useRouter } from 'next/router';

type Props = {
  isNeed?: boolean;
  items: Offer[] | Need[];
};

const makeTitleLinkTextLink = (isNeed: boolean) => {
  const { t } = useTranslation('common');

  const isSuggestedNeeds = {
    title: t('DashboardSuggested_needs_text'),
    linkText: t('DashboardSuggested_needs_link'),
    empty: t('Dashboard_My_Work_my_suggested_needs_empty'),
    link: '/needs',
    alt: 'my-suggested-needs-image-'
  };

  const isSuggestedOffers = {
    title: t('DashboardSuggested_offers_text'),
    linkText: t('DashboardSuggested_offers_link'),
    empty: t('DashboardSuggested_offers_empty'),
    link: '/offers',
    alt: 'my-suggested-offer-image-'
  };

  return isNeed ? isSuggestedNeeds : isSuggestedOffers;
};

const DashboardSuggested = ({ isNeed = false, items }: Props) => {
  const { t } = useTranslation('common');
  const { title: sectionTittle, linkText, link, empty } = makeTitleLinkTextLink(isNeed);
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.topText}>
        <span className={classNames(styles.title, isNeed ? styles.colorRed : styles.colorGreen)}>
          {sectionTittle}
        </span>
        <Link
          className={classNames(styles.linkText, isNeed ? styles.colorRed : styles.colorGreen)}
          href={link}>
          {linkText}
        </Link>
      </div>
      {items && items.length > 0 ? (
        <div className={styles.itemsRow}>
          {items.map((item, index) => {
            const { area, problemTitle } = item;
            const imageSrc = useImageUrl(
              'image' in item ? item.image.filename : item.representativePhoto.filename
            );
            return (
              <div
                className={styles.item}
                key={item._id}
                onClick={() =>
                  router.push(
                    `/${isNeed ? needOfferPath.NEEDS : needOfferPath.OFFERS}?id=${item._id}`
                  )
                }>
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
                <div>
                  <span
                    className={classNames(
                      styles.category,
                      isNeed ? styles.colorRed : styles.colorGreen
                    )}>
                    {t(area.name)}
                  </span>
                </div>

                <span className={styles.title}>{problemTitle}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.itemsRowEmpty}>{empty}</div>
      )}
    </div>
  );
};

export default DashboardSuggested;
