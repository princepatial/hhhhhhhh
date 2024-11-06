import Link from 'next/link';
import styles from './SinglePage.module.scss';
import CheckStatus from '../CheckStatus';
import { HelpFormValues, SingleNeedOffer } from 'globalTypes';
import Details from '../Details';
import IconButton from '../IconButton';
import deleteIcon from '@images/delete.svg';
import { useTranslation } from 'next-i18next';
import Button from '@components/Button';
import Image from 'next/image';
import chatBackgroundImg from '@images/chat-background.png';
import classNames from 'classnames';
import arrowBack from '@images/arrow_green.svg';
import AvatarWithStatus from '@components/AvatarWithStatus';
import useImageUrl from 'hooks/getImageUrl';
import { useState } from 'react';
import CrudOfferNeed from '../CrudOfferNeed';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import ChatHistory from '../../ChatHistory';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import ChatHistoryWrapper from '@components/ChatHistory/ChatHistoryWrapper';

type Props = {
  data: SingleNeedOffer;
  status: 'error' | 'success';
  error: Error | null;
  isNeed?: boolean;
  id: string;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<SingleNeedOffer | null, Error | null>>;
};

const SinglePage = ({
  status,
  error,
  data: singleNeedOffer,
  isNeed = false,
  id,
  refetch
}: Props) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { needOffer, interactionRecipients } = singleNeedOffer;
  const [activeConversation, setActiveConversation] = useState<{ id: string; date: string } | null>(
    null
  );
  const [isActiveChat, setIsActiveChat] = useState(false);
  const [isNeedDialogOpen, setIsNeedDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupStateResolved, setIsPopupStateResolved] = useState(false);

  const needOfferImage = useImageUrl(
    'image' in needOffer ? needOffer?.image.filename : needOffer?.representativePhoto.filename
  );

  const editValues = {
    title: needOffer.problemTitle,
    hashtags: needOffer?.hashtags,
    description: needOffer.description,
    newOfferDate: needOffer.availableFrom,
    image: needOfferImage
  } as HelpFormValues;

  return (
    <CheckStatus status={status} error={error} isData={!!needOffer}>
      <div className={styles.container}>
        <div className={styles.sideNav}>
          <div className={styles.itemDetails}>
            <Link className={styles.backLink} href={`/dashboard/my-work${isNeed ? '' : '#offers'}`}>
              <Image
                src={arrowBack}
                width={16}
                height={16}
                className={styles.arrow}
                alt="arrowBack"
              />
              {t(`SinglePage_back_to_${isNeed ? 'needs' : 'offers'}`)}
            </Link>
            {needOffer && (
              <>
                <Details
                  needOfferId={needOffer._id}
                  isNeed={isNeed}
                  imageId={
                    'image' in needOffer
                      ? needOffer.image.filename
                      : needOffer.representativePhoto.filename
                  }
                  description={needOffer.description}
                  category={needOffer.area.name}
                  hashtags={needOffer.hashtags}
                  problemTitle={needOffer.problemTitle}
                  user={needOffer.user}
                  isActive={needOffer?.isActive}
                  isUserStatusVisible={false}
                />

                <div className={styles.buttons}>
                  <Button
                    style={classNames(styles.button, styles.deleteButton)}
                    buttonColor="whiteRed"
                    onClick={() => {
                      setIsPopupStateResolved(false);
                      setIsPopupOpen(true);
                    }}>
                    <>
                      <IconButton alt="deleteIcon" icon={deleteIcon} />
                      <span className={styles.deleteText}>{t(`MyWork_button_delete`)}</span>
                    </>
                  </Button>
                  <div className={styles.rightButtons}>
                    <Button
                      disabled={!needOffer.isActive}
                      style={styles.button}
                      buttonColor="whiteGreen"
                      onClick={() =>
                        needOffer.isActive &&
                        (isNeed ? setIsNeedDialogOpen(true) : setIsOfferDialogOpen(true))
                      }
                      text={t(`MyWork_button_edit`)}
                    />
                    <Button
                      style={styles.button}
                      onClick={() => {
                        setIsPopupStateResolved(true);
                        setIsPopupOpen(true);
                      }}
                      text={
                        needOffer?.isActive
                          ? t(`MyWork_button_resolved`)
                          : t('MyWork_button_active')
                      }
                    />
                  </div>
                </div>
                <CrudOfferNeed
                  editValues={editValues}
                  availableFrom={needOffer.availableFrom}
                  areaId={needOffer.area._id}
                  isActive={needOffer?.isActive}
                  refetch={refetch}
                  onDeleteSinglePage={() => router.push('/dashboard/my-work')}
                  id={id}
                  isNeed={isNeed}
                  isNeedDialogOpen={isNeedDialogOpen}
                  isOfferDialogOpen={isOfferDialogOpen}
                  isPopupOpen={isPopupOpen}
                  isPopupStateResolved={isPopupStateResolved}
                  setIsNeedDialogOpen={setIsNeedDialogOpen}
                  setIsOfferDialogOpen={setIsOfferDialogOpen}
                  setIsPopupOpen={setIsPopupOpen}
                />
              </>
            )}
          </div>

          <div className={styles.chatsList}>
            <span className={styles.title}>{t('SinglePage_chats')}</span>
            <div className={styles.list}>
              {interactionRecipients.length < 1 ? (
                <span className={styles.noChats}>{t('SinglePage_no_chats')}</span>
              ) : (
                interactionRecipients.map((item) => {
                  const avatarUser = useImageUrl(item.avatar);
                  const date = dayjs(item.updatedAt).format('DD.MM.YYYY');
                  const active = { id: item._id, date: date };

                  const showChat = () => {
                    setIsActiveChat(true);
                    setActiveConversation(() => active);
                  };

                  return (
                    <div className={styles.item} key={item._id} onClick={showChat}>
                      <div className={styles.user}>
                        <AvatarWithStatus imageSrc={avatarUser} userId={item._id} />
                        <span className={styles.firstName}>{item.firstName}</span>
                      </div>

                      <span className={styles.date}>{date}r</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <ChatHistoryWrapper isActiveChat={isActiveChat} setIsActiveChat={setIsActiveChat}>
          <>
            {activeConversation && (
              <ChatHistory needOfferId={needOffer._id} activeConversation={activeConversation} />
            )}
          </>
        </ChatHistoryWrapper>
      </div>
    </CheckStatus>
  );
};

export default SinglePage;
