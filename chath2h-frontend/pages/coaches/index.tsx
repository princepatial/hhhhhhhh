import AdvertisementList from '@components/Advertisement/AdvertisementList';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import styles from '../../components/NeedsAndOffer/NeedsAndOffer.module.scss';
import stylesCoach from './coaches.module.scss';
import {useEffect, useRef, useState} from 'react';
import { useAds } from 'queries/adsQuery';
import { AdsLocation, CoachPage } from 'globalTypes';
import CoachesList from '@components/CoachPage/CoachesList';
import CoachSelectedDetails from '@components/CoachPage/CoachSelectedDetails';
import classNames from 'classnames';
import Nku from '@components/Advertisement/Nku';
import { useRouter } from 'next/router';
import Back from '@components/Back';
import useCheckAdvertHeight from 'hooks/useCheckAdvertHeight';

const Coaches = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: adsList, refetch: refetchAds } = useAds(AdsLocation.COACHES);
  const { data: smallAds, refetch: refetchAdsSmall } = useAds(AdsLocation.COACHES_SMALL);
  const router = useRouter();
  const [activeCoach, setActiveCoach] = useState<CoachPage | null>(null);
  const [counterFetch, setCounterFetch] = useState(0);
  const [isAdvertPopupOpen, setIsAdvertPopupOpen] = useState(false);
  const [id, setId] = useState(undefined as string | undefined);

  const refAdvert = useRef<HTMLDivElement | null>(null);
  const refAdvertRight = useRef<HTMLDivElement | null>(null);
  const isAdvertHigherThanWindow = useCheckAdvertHeight(refAdvert);
  const isAdvertHigherThanWindowRight = useCheckAdvertHeight(refAdvertRight);

  const scrollToTopStyle = isAdvertHigherThanWindowRight ? styles.flexEnd : styles.flexStart;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const item = e.currentTarget;
    const scrollHeighCloseToBottom = item.clientHeight > item.scrollHeight - item.scrollTop - 30;
    if (scrollHeighCloseToBottom) {
      setCounterFetch((prevState) => prevState + 1);
    }
  };

  useEffect(() => {
    if (!router?.query?.id) {
      setActiveCoach(null);
    }
    setId(typeof router?.query?.id === 'string' ? router?.query?.id : undefined);
  }, [router.query])

  return (
    <div className={classNames(styles.container, stylesCoach.container)}>
      <div
        ref={refAdvert}
        className={classNames(
          styles.advertisementWrapper,
          stylesCoach.coachesMobileAdvertisement,
          isAdvertPopupOpen && styles.index,
          isAdvertHigherThanWindow ? styles.flexEnd : styles.flexStart
        )}>
        {adsList && (
          <AdvertisementList
            ads={adsList}
            setIsAdvertPopupOpen={setIsAdvertPopupOpen}
            location={AdsLocation.COACHES}
            refetchAds={refetchAds}
          />
        )}
      </div>

      <div
        className={classNames(
          styles.needsContainer,
          stylesCoach.needsOffer,
          activeCoach && styles.needsContainerMobile
        )}>
        <CoachesList
          id={id}
          setActiveCoach={setActiveCoach}
          activeCoach={activeCoach}
        />
      </div>
      <div
        ref={refAdvertRight}
        className={classNames(
          styles.problemDetails,
          stylesCoach.details,
          activeCoach && stylesCoach.detailsMobileActive,
          scrollToTopStyle
        )}
        onScroll={handleScroll}>
        {activeCoach && <Back onClick={() => setActiveCoach(null)} />}
        {!activeCoach ? (
          <div className={classNames(styles.advertisement, stylesCoach.coachesAdvertisement)}>
            <Nku />
            {smallAds && (
              <AdvertisementList
                ads={smallAds}
                location={AdsLocation.COACHES_SMALL}
                refetchAds={refetchAdsSmall}
              />
            )}
          </div>
        ) : (
          <CoachSelectedDetails activeCoach={activeCoach} counterFetch={counterFetch} />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Coaches;
