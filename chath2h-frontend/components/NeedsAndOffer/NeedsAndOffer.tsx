import DetailsWrapper from 'components/NeedsAndOffer/Details/DetailsWrapper';
import MainContent from './MainContent';
import styles from './NeedsAndOffer.module.scss';
import { useEffect, useRef, useState } from 'react';
import {
  ActiveComponents,
  CoachPage,
  FilterEnumType,
  AdsLocation,
  CoachesWithCategories,
  Need,
  Offer,
  PagePagination,
  StateSetterType,
  ActiveComponentsDetailsEnum
} from 'globalTypes';
import CoachDetails from 'components/Coach/CoachDetails';
import Details from 'components/NeedsAndOffer/Details';
import axios from 'axios';
import CategoriesFilters from 'components/CategoriesFilters';
import { useAds } from 'queries/adsQuery';
import AdvertisementList from 'components/Advertisement/AdvertisementList';
import { getGlobalState } from 'globalState';
import useUserNeedOffer from 'hooks/useUsersNeedOffer';
import Nku from '@components/Advertisement/Nku';
import classNames from 'classnames';
import Back from '@components/Back';
import useCheckAdvertHeight from 'hooks/useCheckAdvertHeight';

type Props = {
  isNeedPage?: boolean;
  id?: string;
};

const NeedsAndOffer = ({ isNeedPage = false, id }: Props) => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponents>(
    isNeedPage ? ActiveComponentsDetailsEnum.NEED : ActiveComponentsDetailsEnum.OFFER
  );
  const [activeCoach, setActiveCoach] = useState<CoachesWithCategories | null>(null);
  const [activeNeedOffer, setActiveNeedOffer] = useState<Offer | Need | null>(null);
  const [filteredData, setFilteredData] = useState<PagePagination<Need | Offer>[] | null>(null);
  const [fetchNextPageCounter, setFetchNexPageCounter] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isAdvertPopupOpen, setIsAdvertPopupOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const user = getGlobalState('user');
  const typeAdsSmall = isNeedPage ? AdsLocation.NEEDS_SMALL : AdsLocation.OFFERS_SMALL;
  const typeAds = isNeedPage ? AdsLocation.NEEDS : AdsLocation.OFFERS;

  const { data: adsList, refetch: refetchAds } = useAds(typeAds);
  const { data: smallAds, refetch: refetchAdsSmall } = useAds(typeAdsSmall);

  const isUsersNeedOffer = useUserNeedOffer(activeNeedOffer?.user._id!, user?._id!);

  useEffect(() => {
    const postData: { needId?: string; offerId?: string; coachId?: string } = {};

    if (activeNeedOffer?._id) {
      postData[isNeedPage ? 'needId' : 'offerId'] = activeNeedOffer._id;
    }
    if (Object.keys(postData).length > 0) {
      axios.post('/users/last-visited', postData);
    }
  }, [activeNeedOffer?._id, isNeedPage]);

  useEffect(() => {
    if (activeCoach?.user?._id) {
      const coachId = activeCoach.user._id;
      axios.post('/users/last-visited', { coachId });
    }
  }, [activeCoach?.user._id]);
  
  useEffect(() => {
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      send_to: 'G-GKZG9DYV69'
    });
  }, []);

  useEffect(() => {
    if (id && firstLoad && filteredData && filteredData.length > 0) {
      setFirstLoad(false);
      setActiveNeedOffer(filteredData[0].docs[0]);
    }
  }, [filteredData, firstLoad]);

  const refAdvert = useRef<HTMLDivElement | null>(null);
  const refAdvertRight = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const isAdvertHigherThanWindow = useCheckAdvertHeight(refAdvert);
  const isAdvertHigherThanWindowRight = useCheckAdvertHeight(refAdvertRight);
  const isDetailsHigherThan = useCheckAdvertHeight(refAdvert);

  const scrollToTopStyleAdvert = isAdvertHigherThanWindowRight ? styles.flexEnd : styles.flexStart;
  const scrollToTopStyleRight = styles.flexStart;
  const rightSectionStyle =
    activeNeedOffer || activeCoach ? scrollToTopStyleRight : scrollToTopStyleAdvert;

  return (
    <div className={styles.container}>
      <div
        ref={refAdvert}
        className={classNames(
          styles.advertisementWrapper,
          isAdvertPopupOpen && styles.index,
          isAdvertHigherThanWindow ? styles.flexEndAdvert : styles.flexStartAdvert
        )}>
        {adsList && (
          <AdvertisementList
            ads={adsList}
            location={isNeedPage ? AdsLocation.NEEDS : AdsLocation.OFFERS}
            refetchAds={refetchAds}
            setIsAdvertPopupOpen={setIsAdvertPopupOpen}
          />
        )}
      </div>

      <div
        className={classNames(
          styles.needsContainer,
          (activeNeedOffer || activeCoach) && styles.needsContainerMobile,
          isMobileFilterOpen && styles.filterMobileOpen
        )}>
        <CategoriesFilters
          setIsMobileFilterOpen={setIsMobileFilterOpen}
          isMobileFilterOpen={isMobileFilterOpen}
          setFilteredData={
            setFilteredData as StateSetterType<Array<
              PagePagination<CoachPage | Need | Offer>
            > | null>
          }
          fetchNextPageCounter={fetchNextPageCounter}
          id={id}
          type={isNeedPage ? FilterEnumType.NEED : FilterEnumType.COACH_OFFER}
        />
        {filteredData && (
          <MainContent
            pages={filteredData}
            setFetchNextPageCounter={setFetchNexPageCounter}
            setActiveCoach={setActiveCoach}
            setActiveNeedOffer={setActiveNeedOffer}
            setActiveComponent={setActiveComponent}
            isNeedPage={isNeedPage}
          />
        )}
      </div>
      <div
        ref={detailsRef}
        className={classNames(
          styles.problemDetails,
          (activeNeedOffer || activeCoach) && styles.mobileDetails,
          rightSectionStyle
        )}>
        <>
          <Back
            onClick={() => (activeNeedOffer ? setActiveNeedOffer(null) : setActiveCoach(null))}
          />
          <DetailsWrapper
            activeComponent={activeComponent}
            isNeedPage={isNeedPage}
            activeNeedOffer={activeNeedOffer}
            isUsersNeedOffer={isUsersNeedOffer}
            category={activeNeedOffer?.area?.name}>
            <>
              {activeComponent === ActiveComponentsDetailsEnum.COACH && activeCoach && (
                <CoachDetails
                  isFollowCoach={activeCoach.isFollowed}
                  id={activeCoach.user._id}
                  avatar={activeCoach.user.avatar}
                  coachPhoto={activeCoach.user.coachProfile.coachPhoto}
                  name={activeCoach.user.firstName}
                  about={activeCoach.user.coachProfile.about}
                  competence={activeCoach.user.coachProfile.coachCompetence}
                  categories={activeCoach.areas.map((item) =>
                    typeof item === 'string' ? item : item.name
                  )}
                />
              )}
              {(activeComponent === ActiveComponentsDetailsEnum.NEED ||
                activeComponent === ActiveComponentsDetailsEnum.OFFER) &&
                activeNeedOffer && (
                  <div className={styles.details}>
                    <Details
                      isNeed={isNeedPage}
                      description={activeNeedOffer.description}
                      problemTitle={activeNeedOffer.problemTitle}
                      hashtags={activeNeedOffer.hashtags}
                      needOfferId={activeNeedOffer._id}
                      imageId={
                        'image' in activeNeedOffer
                          ? activeNeedOffer.image.filename
                          : activeNeedOffer.representativePhoto.filename
                      }
                      category={activeNeedOffer.area.name}
                      setActiveCoach={setActiveCoach}
                      user={activeNeedOffer.user}
                      setActiveComponent={setActiveComponent}
                    />
                  </div>
                )}
            </>
          </DetailsWrapper>
        </>

        <div className={classNames(styles.advertisement)} ref={refAdvertRight}>
          {!activeNeedOffer && <Nku />}
          {smallAds && (
            <AdvertisementList
              ads={smallAds}
              location={isNeedPage ? AdsLocation.NEEDS_SMALL : AdsLocation.OFFERS_SMALL}
              refetchAds={refetchAdsSmall}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default NeedsAndOffer;
