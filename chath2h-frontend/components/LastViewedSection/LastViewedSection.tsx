import { LastViewedItems, VisitedSection, needOfferPath } from 'globalTypes';
import styles from './LastViewedSection.module.scss';
import Image from 'next/image';
import classNames from 'classnames';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const LastViewedSection = ({ lastViewedItems }: LastViewedItems) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const redirect = (type: VisitedSection, id: string) => {
    let url: string = '/';
    if (type === VisitedSection.NEED) {
      url += needOfferPath.NEEDS + '?id=' + id;
    } else if (type === VisitedSection.OFFER) {
      url += needOfferPath.OFFERS + '?id=' + id;
    } else if (type === VisitedSection.COACH) {
      url += needOfferPath.COACH + '?id=' + id;
    }
    router.push(url);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {lastViewedItems?.map(({ userName, avatar, areas, type, title, id }, index) => {
          const isCategoriesString = typeof areas === 'string';
          let categories;
          if (isCategoriesString) {
            categories = t(areas) + ' / ';
          } else {
            let slicedAreas = areas.slice(0, 4);
            categories = slicedAreas.map((item, index) => {
              return t(item) + (slicedAreas.length - 1 === index ? '' : ' / ');
            });
          }
          const imageSrc = useImageUrl(avatar);
          return (
            <li
              className={classNames(styles.listItem, type ? styles[`${type}Item`] : '')}
              key={index}
              onClick={() => redirect(type, id)}>
              <Image
                style={{ objectFit: 'cover' }}
                src={imageSrc}
                width={isCategoriesString ? 52 : 56}
                height={isCategoriesString ? 52 : 56}
                className={styles.Image}
                alt="last-viewed-image"
              />
              <div className={styles.listItemContent}>
                <span className={styles.name}>{userName}</span>
                <div>
                  <span className={styles.typeTextItem}>{categories}</span>
                  <span className={styles.title}> {title}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LastViewedSection;
