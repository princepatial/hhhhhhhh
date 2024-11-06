import AvatarWithStatus from '@components/AvatarWithStatus';
import styles from './CoachesList.module.scss';
import CategoriesFilters from '@components/CategoriesFilters';
import useImageUrl from 'hooks/getImageUrl';
import { useEffect, useRef, useState } from 'react';
import {
  CoachPage,
  FilterEnumType,
  Need,
  Offer,
  PagePagination,
  StateSetterType,
  User
} from 'globalTypes';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import useIsInViewport from 'hooks/isInViewport';
import NoData from '@components/NoData';

type Props = {
  setActiveCoach: StateSetterType<CoachPage | null>;
  activeCoach: CoachPage | null;
  id?: string;
};

const CoachesList = ({ setActiveCoach, activeCoach, id }: Props) => {
  const { t } = useTranslation('common');
  const observer = useRef(null);
  const adInViewport = useIsInViewport(observer);
  const [firstLoad, setFirstLoad] = useState(true);
  const [fetchNextPageCounter, setFetchNexPageCounter] = useState(0);
  const [filteredData, setFilteredData] = useState<PagePagination<CoachPage>[] | null>(null);
  const activeCoachId = activeCoach?._id;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (!setFetchNexPageCounter) return;
    if (adInViewport) setFetchNexPageCounter((prevState) => prevState + 1);
  }, [adInViewport]);

  useEffect(() => {
    if (activeCoachId) {
      const coachId = activeCoachId;
      axios.post('/users/last-visited', { coachId });
    }
  }, [activeCoachId]);

  useEffect(() => {
    if (id && firstLoad && filteredData && filteredData.length > 0) {
      setFirstLoad(false);
      setActiveCoach(filteredData[0].docs[0]);
    }
  }, [filteredData]);

  return (
    <>
      <div className={classNames(isMobileFilterOpen && styles.categoriesFilterOpen)}>
        <CategoriesFilters
          isMobileFilterOpen={isMobileFilterOpen}
          setIsMobileFilterOpen={setIsMobileFilterOpen}
          limit={10}
          id={id}
          type={FilterEnumType.COACH}
          fetchNextPageCounter={fetchNextPageCounter}
          setFilteredData={
            setFilteredData as StateSetterType<Array<
              PagePagination<CoachPage | Need | Offer>
            > | null>
          }
        />
      </div>

      {filteredData && (
        <div
          className={classNames(styles.coachList, isMobileFilterOpen && styles.filterMobileOpen)}>
          {filteredData.map((page, indexParent) =>
            page.docs && page.docs.length > 0 ? (
              page.docs.map((item) => {
                const imageSrc = useImageUrl(item.coachProfile?.coachPhoto?.filename || '');
                return (
                  <div
                    className={classNames(
                      styles.coach,
                      activeCoachId === item._id && styles.coachActive
                    )}
                    onClick={() => setActiveCoach(item)}
                    key={item._id}>
                    <div className={styles.info}>
                      <div className={styles.avatar}>
                        <AvatarWithStatus imageSrc={imageSrc} userId={item._id} />
                      </div>

                      <div className={styles.shortDescription}>
                        <div className={styles.nameCategoriesContact}>
                          <div className={styles.nameCategories}>
                            <span className={styles.name}>{item.firstName}</span>

                            {item.categories && item.categories.length > 0 && (
                              <div className={styles.categories}>
                                {item.categories.slice(0, 4).map((category, index) => {
                                  return (
                                    <span key={category._id}>
                                      {index !== 0 && ' / '}
                                      {t(category?.name)}
                                    </span>
                                  );
                                })}
                                {item.categories.length > 5 && (
                                  <span>
                                    {' '}
                                    + {item.categories.length - 4} {t('CoachesList_more')}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={styles.contactMe}>{t('CoachList_coach_contact_me')}</div>
                        </div>
                        <div className={styles.offersCounter}>
                          {t('CoachesList_coach_details_offers')} ({item.offersCount})
                        </div>
                        <div className={styles.about}>
                          <span>{item.coachProfile.about}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.description}>{item.coachProfile.coachCompetence}</div>
                    <div className={styles.aboutMobile}>{item.coachProfile.about}</div>
                  </div>
                );
              })
            ) : (
              <NoData key={indexParent} />
            )
          )}
        </div>
      )}
      <div ref={observer} className={styles.watchedDiv}></div>
    </>
  );
};

export default CoachesList;
