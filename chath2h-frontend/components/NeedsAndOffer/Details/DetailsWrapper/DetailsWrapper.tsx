import StartChat from '@components/Popups/StartChat';
import ChatButton from 'components/ChatButton';
import AddButton from 'components/NeedsAndOffer/AddButton';
import { useGlobalState } from 'globalState';
import { ActiveComponents, ConversationContext, Need, NewMessage, Offer } from 'globalTypes';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import styles from './DetailsWrapper.module.scss';
import { separatorTranslate } from 'helpers';
import { sendMessage } from 'queries/messagesQuery/messagesQuery';
import { useRouter } from 'next/router';
import Dialog from '@components/Dialog';
import SingleNeedOfferDetails from '@components/NeedsAndOffer/SingleNeedOfferDetails';
import useImageUrl from 'hooks/getImageUrl';
import CoachProfileButton from '@components/CoachProfileButton';

type Props = {
  activeNeedOffer: Offer | Need | null;
  activeComponent: ActiveComponents;
  children: JSX.Element;
  isNeedPage?: boolean;
  isUsersNeedOffer: boolean;
  category?: string;
};

const DetailsWrapper = ({
  activeNeedOffer,
  activeComponent,
  children,
  isNeedPage,
  isUsersNeedOffer,
  category
}: Props) => {
  const [isPayEarnPopupOpen, setIsPayEarnPopupOpen] = useState(false);
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const [isCoachProfile] = useGlobalState('isCoachProfile');
  const router = useRouter();
  const [blockButton, setBlockButton] = useState(false);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isCoachPopup, setIsCoachPopup] = useState(undefined as boolean | undefined);
  const topButtonText = t(isNeedPage ? `DetailsWrapper_add_need` : 'DetailsWrapper_add_offer');

  const titleWrapper = useMemo(() => {
    switch (activeComponent) {
      case 'coachDetails':
        return t('DetailsWrapper_coach_details');
      case 'needDetails':
        return t('DetailsWrapper_problem_details');
      case 'offerDetails':
        return t('DetailsWrapper_offer_details');
      default:
        return t('DetailsWrapper_default_details');
    }
  }, [activeComponent]);

  const sendMessageMailbox = async () => {
    if (user && activeNeedOffer) {
      setBlockButton(true);
      const data: NewMessage = {
        from: user._id,
        to: activeNeedOffer.user._id,
        content: `User_offline_busy_1${separatorTranslate}${activeNeedOffer.problemTitle}${separatorTranslate}User_offline_busy_2`,
        conversationContext: isNeedPage
          ? ConversationContext.NEED
          : ConversationContext.COACH_OFFER,
        conversationContextId: activeNeedOffer._id,
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

  const srcImage = useMemo(() => {
    if (!activeNeedOffer) return null;
    return 'image' in activeNeedOffer ? activeNeedOffer.image : activeNeedOffer.representativePhoto;
  }, [activeNeedOffer]);

  const imageSrc = useImageUrl(srcImage?.filename || '');

  return (
    <>
      {activeNeedOffer && (
        <>
          <Dialog isOpen={isDetailsPopupOpen} handleClose={() => setIsDetailsPopupOpen(false)}>
            <div className={styles.dialogDetails}>
              <SingleNeedOfferDetails
                isActive={activeNeedOffer.isActive}
                category={category || ''}
                description={activeNeedOffer.description}
                id={activeNeedOffer._id}
                index={activeNeedOffer._id}
                isNeed={isNeedPage}
                title={activeNeedOffer.problemTitle}
                hashtags={activeNeedOffer.hashtags}
                imageSrc={imageSrc}
                showPriceInfo
              />

              {!!activeNeedOffer &&
                activeComponent !== 'coachDetails' &&
                !isUsersNeedOffer &&
                user && (
                  <div className={styles.chatButton}>
                    <ChatButton
                      disabled={blockButton}
                      text={t('ChatButton_send_message')}
                      handleClick={() => sendMessageMailbox()}
                    />
                    {!isNeedPage || isCoachProfile ? (
                      <ChatButton showTooltip
                                  isCoach={isCoachPopup}
                                  handleClick={() => setIsPayEarnPopupOpen(true)} />
                    ) : (
                      <CoachProfileButton />
                    )}
                  </div>
                )}
            </div>
          </Dialog>
          <StartChat
            isPayEarnPopupOpen={isPayEarnPopupOpen}
            isNeedPage={isNeedPage}
            needOffer={activeNeedOffer}
            setIsCoachPopup={setIsCoachPopup}
            setIsPayEarnPopupOpen={setIsPayEarnPopupOpen}
          />
        </>
      )}
      <div className={styles.container}>
        <div className={styles.addOffer}>
          <AddButton text={topButtonText} color={isNeedPage ? 'red' : 'limeGreen'} />
        </div>
        <div className={styles.detailsTitle}>
          <span className={styles.title}>{titleWrapper}</span>
        </div>
        <div className={styles.details} onClick={() => setIsDetailsPopupOpen(true)}>
          {children}
        </div>

        {!!activeNeedOffer && activeComponent !== 'coachDetails' && !isUsersNeedOffer && user && (
          <div className={styles.chatButton}>
            <ChatButton
              disabled={blockButton}
              text={t('ChatButton_send_message')}
              handleClick={() => sendMessageMailbox()}
            />
            {!isNeedPage || isCoachProfile ? (
              <ChatButton showTooltip
                          isCoach={isCoachPopup}
                          handleClick={() => setIsPayEarnPopupOpen(true)} />
            ) : (
              <CoachProfileButton />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DetailsWrapper;
