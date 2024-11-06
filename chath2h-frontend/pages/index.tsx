import tokenLeft from '@landingPageImages/H2H_token_left.png';
import tokenRight from '@landingPageImages/H2H_token_right.png';
import communityImg from '@landingPageImages/community_of_trust.png';
import dog1 from '@landingPageImages/dog1.png';
import dog2 from '@landingPageImages/dog2.png';
import dog3 from '@landingPageImages/dog3.png';
import photo1 from '@landingPageImages/photo1.webp';
import photo10 from '@landingPageImages/photo10.png';
import photo11 from '@landingPageImages/photo11.png';
import photo12 from '@landingPageImages/photo12.png';
import photo13 from '@landingPageImages/photo13.png';
import photo14 from '@landingPageImages/photo14.png';
import photo2 from '@landingPageImages/photo2.png';
import photo3 from '@landingPageImages/photo3.png';
import photo4 from '@landingPageImages/photo4.png';
import photo5 from '@landingPageImages/photo5.png';
import photo6 from '@landingPageImages/photo6.png';
import photo7 from '@landingPageImages/photo7.png';
import photo8 from '@landingPageImages/photo8.png';
import photo9 from '@landingPageImages/photo9.png';
import classNames from 'classnames';
import CaptionPhoto from 'components/LandingPage/CaptionPhoto';
import TopCaptionPhoto from 'components/LandingPage/TopCaptionPhoto';
import TopCoaches from 'components/TopCoaches';
import { setGlobalState } from 'globalState';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect, useRef } from 'react';
import styles from './index.module.scss';

export default function Home(_props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common');
  const missionRef = useRef<HTMLDivElement | null>(null);

  const onBecomePartnerClick = () => {
    window.location.href = 'mailto:info@chath2h.com?subject=H2H Partnership';
  };

  const onBecomeSponsorClick = () => {
    window.location.href = 'mailto:info@chath2h.com?subject=H2H Sponsorship';
  };

  useEffect(() => {
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      send_to: 'G-GKZG9DYV69'
    });
  }, []);

  const onRegisterOrLoginClick = () => {
    Router.push('/authorization');
  };

  useEffect(() => {
    setGlobalState('missionRef', missionRef);
  }, []);

  return (
    <div className={styles.container}>
      <CaptionPhoto
        imgLink={photo1}
        altImg="two people"
        leftImg={communityImg}
        rightImg={dog1}
        rightImageClass={styles.desktop_only_element}
        onButtonClick={onBecomePartnerClick}
        textBackground={classNames(
          styles.textBackground,
          styles.firstBackground,
          styles.no_right_photo
        )}
        isPriority={true}
        textPhotoStyles={styles.firstPhotoTitle}
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_first_text') }} />}>
        <div ref={missionRef}>
          <ul className={styles.firstPhotoCaption}>
            <li dangerouslySetInnerHTML={{ __html: t('index_first_text_first_bullet') }} />
            <li dangerouslySetInnerHTML={{ __html: t('index_first_text_second_bullet') }} />
            <li dangerouslySetInnerHTML={{ __html: t('index_first_text_third_bullet') }} />
          </ul>
        </div>
      </CaptionPhoto>
      <CaptionPhoto
        textPhotoStyles={styles.secondPhotoTitle}
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_second_text') }} />}
        counterText={t('index_people_number')}
        secondLine={t('index_get_advice')}
        imgLink={photo2}
        altImg="girl talking by phone"
        buttonText={t('index_become_partner')}
        customButtonStyles={styles.registerLoginButton}
        onButtonClick={onBecomePartnerClick}
        textBackgroundCover
        textBackground={classNames(styles.textBackground, styles.secondBackground)}>
        <>{t('index_environmental_consciousness')}</>
      </CaptionPhoto>
      <CaptionPhoto
        leftImg={communityImg}
        rightImg={dog2}
        rightImageClass={styles.enlarged_image}
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_third_text') }} />}
        counterText={t('index_people_number_worldwide')}
        secondLine={t('index_seek_professional_help')}
        imgLink={photo3}
        altImg="old man using the phone"
        textBackgroundCover
        textBackground={classNames(styles.textBackground, styles.secondBackground)}>
        <>{t('index_engaging_conversations')}</>
      </CaptionPhoto>
      <CaptionPhoto
        photoText={t('index_h2hToken')}
        counterText={t('index_h2hTokens_number')}
        secondLine={t('index_made_available')}
        imgLink={photo4}
        altImg="young man taking selfie"
        buttonText={t('index_become_sponsor')}
        customButtonStyles={styles.registerLoginButton}
        onButtonClick={onBecomeSponsorClick}
        textBackground={classNames(styles.textBackground, styles.thirdBackground)}>
        <>{t('index_valuable_guidance')}</>
      </CaptionPhoto>
      <CaptionPhoto
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_fourth_text') }} />}
        counterText={t('index_global_community')}
        secondLine={t('index_individuals')}
        imgLink={photo5}
        rightImg={dog3}
        rightImageClass={styles.desktop_only_element}
        leftImg={communityImg}
        altImg="group of young people"
        textBackgroundCover
        textBackground={classNames(styles.textBackground, styles.secondBackground)}>
        <>{t('index_good_advice')}</>
      </CaptionPhoto>
      <CaptionPhoto
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_fifth_text') }} />}
        counterText={t('index_h2hTokens_number')}
        secondLine={t('index_share_experience')}
        leftImg={tokenLeft}
        rightImg={tokenRight}
        imgLink={photo6}
        altImg="girl"
        textBackground={classNames(styles.textBackground, styles.firstBackground)}>
        <>{t('index_receiving_answer')}</>
      </CaptionPhoto>
      <CaptionPhoto
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_sixth_text') }} />}
        counterText={t('index_enjoy_welcoming_gift')}
        secondLine={t('index_key_conversations')}
        imgLink={photo7}
        altImg="girl"
        buttonText={t('index_register_or_login')}
        customButtonStyles={styles.registerLoginButton}
        onButtonClick={onRegisterOrLoginClick}
        textBackgroundCover
        textBackground={classNames(styles.textBackground, styles.secondBackground)}>
        <>{t('index_discover_power')}</>
      </CaptionPhoto>
      <CaptionPhoto
        leftImg={communityImg}
        counterText={t('index_people_across_globe')}
        secondLine={t('index_role')}
        buttonText={t('index_register_or_login')}
        customButtonStyles={styles.registerLoginButton}
        onButtonClick={onRegisterOrLoginClick}
        videoLink="/landing_page_video.mov"
        altImg="video with a happy girl"
        textBackground={classNames(styles.textBackground, styles.thirdBackground, styles.alt)}>
        <>{t('index_valuable_experiences')}</>
      </CaptionPhoto>
      <CaptionPhoto
        photoText={<span dangerouslySetInnerHTML={{ __html: t('index_seventh_text') }} />}
        counterText={t('index_mutual_help')}
        imgLink={photo8}
        altImg="dog"
        textBackground={classNames(styles.textBackground, styles.firstBackground, styles.alt)}
        bottomVideo={
          <div className={styles.iframeWrapper}>
            <iframe
              className={styles.iframe}
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/i-puQXD09po?rel=0&controls=0"
              title="YouTube video player"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
          </div>
        }>
        <div className={styles.loyal}>{t('index_loyal')}</div>
      </CaptionPhoto>
      <div className={styles.joinInfo}>
        <span>{t('index_join_text')}</span>
      </div>
      <TopCaptionPhoto
        imgSrc={photo9}
        atlImg="woman with open sign"
        caption={t('index_person_first')}
      />
      <TopCaptionPhoto
        imgSrc={photo10}
        atlImg="people doing exercises"
        caption={t('index_person_second')}
      />
      <TopCaptionPhoto
        imgSrc={photo11}
        atlImg="group of people"
        caption={t('index_person_third')}
      />
      <TopCaptionPhoto
        imgSrc={photo12}
        atlImg="woman with the dog"
        caption={t('index_person_fourth')}
      />
      <TopCaptionPhoto imgSrc={photo13} atlImg="jogging" caption={t('index_person_fifth')} />
      <div className={styles.lastPhoto}>
        <TopCaptionPhoto
          imgSrc={photo14}
          atlImg="smiling woman"
          caption={t('index_person_sixth')}
        />
        <Link href="/authorization" className={styles.joinNow}>
          <span dangerouslySetInnerHTML={{ __html: t('index_joinnow_text') }} />
        </Link>
      </div>
      <TopCoaches />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
