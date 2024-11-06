import {
  CoachPage,
  ConversationContext,
  FilterEnumType,
  FiltersCoach,
  FiltersNeedOffer,
  NewMessage
} from 'globalTypes';
import styles from './CoachSelectedDetails.module.scss';
import CoachBigTile from '@components/Coach/CoachBigTile';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Details from '@components/NeedsAndOffer/Details';
import StartChat from '@components/Popups/StartChat';
import { useEffect, useState } from 'react';
import ChatButton from '@components/ChatButton';
import { useGlobalState } from 'globalState';
import { useFilteredData } from 'queries/filterQuery';
import AvatarWithStatus from '@components/AvatarWithStatus';
import useUserNeedOffer from 'hooks/useUsersNeedOffer';
import { separatorTranslate } from 'helpers';
import { sendMessage } from 'queries/messagesQuery/messagesQuery';
import { useRouter } from 'next/router';
import {bool} from "yup";

type Props = {
  activeCoach: CoachPage | null;
  counterFetch: number;
};

const limit = 5;
const CoachSelectedDetails = ({ activeCoach, counterFetch }: Props) => {
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const router = useRouter();
  const [blockButton, setBlockButton] = useState(false);
  const [isPayEarnPopupOpen, setIsPayEarnPopupOpen] = useState('');
  const imageSrc = useImageUrl(activeCoach?.coachProfile.coachPhoto?.filename || '');
  const [isCoachPopup, setIsCoachPopup] = useState(undefined as boolean | undefined);
  const filter: FiltersCoach | FiltersNeedOffer | undefined = activeCoach?._id
    ? { user: { _id: activeCoach?._id } }
    : undefined;

  const {
    data: filteredOffers,
    refetch,
    fetchNextPage
  } = useFilteredData(FilterEnumType.COACH_OFFER, limit, -1, filter);

  const categories = activeCoach?.categories && activeCoach?.categories.slice(0, 4);

  useEffect(() => {
    if (!counterFetch) return;
    fetchNextPage();
  }, [counterFetch]);

  const startChatClick = (id: string, value: boolean) => {
    setIsPayEarnPopupOpen( value ? id : '');
  };

  return (
    <>
      <div className={classNames(styles.offerTitle, styles.coachDetailsText)}>
        {t('CoachSelectedDetails_title_details')}
      </div>
      {activeCoach && categories && (
        <div className={styles.coachDetails}>
          <div className={styles.coachDetailsMobile}>
            <AvatarWithStatus imageSrc={imageSrc} userId={activeCoach._id} />
            <div className={styles.coachInfo}>
              <div className={styles.name}>{activeCoach.firstName}</div>
              <div className={styles.about}>{activeCoach.coachProfile.about}</div>
            </div>
          </div>
          <div className={styles.descriptionMobile}>{activeCoach.coachProfile.coachCompetence}</div>
          <div className={styles.coachDetailsDesktop}>
            <CoachBigTile
              isFollowCoach={activeCoach?.isFollowed}
              imageSrc={imageSrc}
              categories={categories}
              name={activeCoach.firstName}
              id={activeCoach._id}
            />
          </div>
        </div>
      )}
      <div className={classNames(styles.offerTitle, !activeCoach && styles.coachOfferMargin)}>
        <span>{t('CoachSelectedDetails_coach_offers')}</span>
        {activeCoach?.offersCount && (
          <div className={styles.coachOfferCounter}>{activeCoach?.offersCount}</div>
        )}
      </div>
      {!!activeCoach && (
        <div className={styles.coachOffersList}>
          {filteredOffers?.pages.map((offers, index) => {
            return (
              <div key={index} className={styles.wrapper}>
                {offers.docs.map((item, docsIndex) => {
                  const sendMessageMailbox = async () => {
                    if (user && item && 'problemTitle' in item) {
                      setBlockButton(true);
                      const data: NewMessage = {
                        from: user._id,
                        to: item.user._id,
                        content: `User_offline_busy_1${separatorTranslate}${item.problemTitle}${separatorTranslate}User_offline_busy_2`,
                        conversationContext: ConversationContext.COACH_OFFER,
                        conversationContextId: item._id,
                        systemMessage: true
                      };

                      const message = await sendMessage(data);

                      const query = {
                        conversationId: message.existingConversationId
                      };

                      router.push({
                        pathname: '/mailbox',
                        query
                      });
                    }
                  };

                  const isUsersNeedOffer = useUserNeedOffer(item?.user?._id!, user?._id!);
                  if (!('representativePhoto' in item)) return;
                  return (
                    <div key={item._id} className={styles.coachOffer}>
                      <Details
                        isCoachPage
                        hashtags={item.hashtags}
                        imageId={item.representativePhoto.filename}
                        category={item.area.name}
                        description={item.description}
                        problemTitle={item.problemTitle}
                        needOfferId={item._id}
                      />

                      {user && !isUsersNeedOffer && (
                        <div className={styles.startChat}>
                          <ChatButton
                            disabled={blockButton}
                            text={t('ChatButton_send_message')}
                            handleClick={() => sendMessageMailbox()}
                          />
                          <ChatButton handleClick={() => startChatClick(item._id, true)} showTooltip />
                          <StartChat
                            needOffer={item}
                            setIsCoachPopup={setIsCoachPopup}
                            setIsPayEarnPopupOpen={(value: boolean) => startChatClick(item._id, value)}
                            isPayEarnPopupOpen={isPayEarnPopupOpen === item._id}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CoachSelectedDetails;
