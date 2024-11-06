import Tile from 'components/NeedsAndOffer/Tile';
import CoachTileRow from 'components/Coach/CoachTileRow';
import { useEffect, useRef } from 'react';
import {
  ActiveComponents,
  CoachesWithCategories,
  Need,
  Offer,
  PagePagination,
  StateSetterType
} from 'globalTypes';
import useIsInViewport from 'hooks/isInViewport';
import styles from './MainContent.module.scss';
import NoData from '@components/NoData';

type Props = {
  pages: PagePagination<Need | Offer>[] | null;
  isNeedPage: boolean;
  setActiveNeedOffer: StateSetterType<Need | Offer | null>;
  setActiveCoach: StateSetterType<CoachesWithCategories | null>;
  setActiveComponent: StateSetterType<ActiveComponents>;
  setFetchNextPageCounter: StateSetterType<number>;
};

const MainContent = ({
  pages,
  setFetchNextPageCounter,
  isNeedPage,
  setActiveNeedOffer,
  setActiveCoach,
  setActiveComponent
}: Props) => {
  const observer = useRef(null);
  const adInViewport = useIsInViewport(observer);

  useEffect(() => {
    if (!setFetchNextPageCounter) return;
    if (adInViewport) setFetchNextPageCounter((prevState) => prevState + 1);
  }, [adInViewport]);

  return (
    <>
      {pages &&
        pages.map((page, indexParent: number) => {
          const defaultCheckToShow = page?.docs && page.docs.length > 0;
          const isLowerThan7 = indexParent === 0 && page.docs.length <= 7;
          const moreThanSevenAndDivideBySeven = page.docs.length % 7 === 0;
          const checkIfShowCoaches =
            defaultCheckToShow && (isLowerThan7 || moreThanSevenAndDivideBySeven);

          return (
            <div key={indexParent}>
              {page?.docs && pages[0].docs.length ? (
                page.docs.map((item, index) => (
                  <Tile
                    key={item._id}
                    userId={item.user?._id}
                    imageSrc={
                      'image' in item ? item.image?.filename : item.representativePhoto?.filename
                    }
                    category={item.area?.name}
                    description={item.description}
                    firstName={item.user?.firstName}
                    problemTitle={item.problemTitle}
                    time={'updatedAt' in item ? item.updatedAt : null}
                    isNeed={isNeedPage}
                    index={index}
                    onClick={() => {
                      setActiveNeedOffer(item);
                      setActiveComponent(isNeedPage ? 'needDetails' : 'offerDetails');
                    }}
                    onCoachNameClick={() => {
                      const newCoach = {
                        areas: item?.user?.areas || [],
                        user: item.user
                      };
                      setActiveCoach(newCoach), setActiveComponent('coachDetails');
                    }}
                  />
                ))
              ) : (
                <NoData />
              )}
              {checkIfShowCoaches && page.coaches && (
                <CoachTileRow
                  coaches={page.coaches}
                  setActiveCoach={setActiveCoach}
                  setActiveComponent={setActiveComponent}
                  index={indexParent}
                />
              )}
            </div>
          );
        })}
      <div ref={observer} className={styles.watchedDiv}></div>
    </>
  );
};

export default MainContent;
