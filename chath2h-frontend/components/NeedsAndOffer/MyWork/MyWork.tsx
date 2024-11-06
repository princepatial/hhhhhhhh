import styles from './MyWork.module.scss';
import { HelpFormValues, Photo, MyNeedsAndOffers, PageViewState } from 'globalTypes';
import classNames from 'classnames';
import IconButton from 'components/NeedsAndOffer/IconButton';
import editIcon from '@images/edit.svg';
import shareIcon from '@images/share.svg';
import Button from 'components/Button';
import { useMemo, useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import useImageUrl from 'hooks/getImageUrl';
import { Tooltip } from 'react-tooltip';
import CrudOfferNeed from '../CrudOfferNeed';
import { useRouter } from 'next/router';
import AddButton from '../AddButton';
import Dialog from '@components/Dialog';
import CreateCoachProfile from 'components/CoachProfileForm';
import { useGlobalState } from 'globalState';
import SingleNeedOfferDetails from '../SingleNeedOfferDetails';

type Props = {
  id: string;
  image: Photo;
  title: string;
  description: string;
  category: string;
  hashtags?: string[];
  index: number;
  pageViewState: PageViewState;
  availableFrom?: Date;
  areaId?: string;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult<MyNeedsAndOffers | null, Error | null>>;
  isActive?: boolean;
  hasChats?: boolean;
};

const MyWork = ({
  refetch,
  id,
  image,
  title,
  description,
  category,
  hashtags,
  index,
  pageViewState,
  availableFrom,
  areaId,
  isActive,
  hasChats
}: Props) => {
  const { t } = useTranslation('common');
  const [isNeedDialogOpen, setIsNeedDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const isNeed = useMemo(() => pageViewState === 'needs', [pageViewState]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupStateResolved, setIsPopupStateResolved] = useState(false);
  const [isCopiedToolTipOpen, setIsCopiedToolTipOpen] = useState(false);
  const [isCreateCoachDialogOpen, setIsCreateCoachDialogOpen] = useState(false);
  const [isCoachProfile] = useGlobalState('isCoachProfile');

  const imageSrc = useImageUrl(image.filename);

  const editValues = {
    title,
    hashtags: hashtags?.length ? hashtags : null,
    description,
    newOfferDate: availableFrom,
    image: imageSrc
  } as HelpFormValues;

  const onCopyElement = () => {
    if (!isActive) return;
    setIsCopiedToolTipOpen(true);
    const origin =
      typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const url = origin + '/' + pageViewState + '?id=' + id;
    navigator.clipboard.writeText(url);
    setTimeout(() => setIsCopiedToolTipOpen(false), 2000);
  };

  const onResolvedDelete = (isDelete: boolean = false) => {
    setIsPopupStateResolved(isDelete);
    setIsPopupOpen(true);
  };

  return (
    <div className={styles.container}>
      <Dialog
        isOpen={isCreateCoachDialogOpen}
        title={t('SingleArea_create_coach_profile')}
        handleClose={() => setIsCreateCoachDialogOpen(false)}>
        <div className={styles.coachProfileForm}>
          <CreateCoachProfile handleCancel={() => setIsCreateCoachDialogOpen(false)} />
        </div>
      </Dialog>
      <SingleNeedOfferDetails
        isActive={isActive}
        category={category}
        description={description}
        hasChats={hasChats}
        id={id}
        index={index}
        isNeed={isNeed}
        pageViewState={pageViewState}
        title={title}
        hashtags={hashtags}
        imageSrc={imageSrc}
      />
      <div className={classNames(styles.crudButtons)}>
        <div className={styles.shareEdit}>
          <Button
            disabled={!isActive}
            style={classNames(styles.shareButton, styles.chatButton, 'my-anchor-element')}
            text={t(`MyWork_button_share`)}
            buttonColor="whiteGreen"
            onClick={onCopyElement}>
            <>
              <Tooltip
                openOnClick
                isOpen={isCopiedToolTipOpen}
                content="copied"
                anchorSelect=".my-anchor-element"
                place="top"
                className={styles.tooltip}
              />

              {isActive && <IconButton alt="shareIcon" icon={shareIcon} />}
            </>
          </Button>
          <Button
            style={classNames(styles.editButton, styles.chatButton)}
            text={t(`MyWork_button_edit`)}
            buttonColor="whiteGreen"
            onClick={() => (isNeed ? setIsNeedDialogOpen(true) : setIsOfferDialogOpen(true))}>
            <IconButton alt="editIcon" icon={editIcon} />
          </Button>
        </div>
        <div className={styles.addButtons}>
          <AddButton text={t('TopButton_needText')} color={'red'} />
          <AddButton
            text={t('TopButton_offerText')}
            color={'limeGreen'}
            offerCheckIsCoach={!isCoachProfile ? setIsCreateCoachDialogOpen : undefined}
          />
        </div>
      </div>
      <CrudOfferNeed
        onResolvedDelete={onResolvedDelete}
        areaId={areaId}
        availableFrom={availableFrom}
        editValues={editValues}
        id={id}
        isActive={isActive}
        isNeed={isNeed}
        isNeedDialogOpen={isNeedDialogOpen}
        isOfferDialogOpen={isOfferDialogOpen}
        isPopupOpen={isPopupOpen}
        isPopupStateResolved={isPopupStateResolved}
        refetch={refetch}
        setIsNeedDialogOpen={setIsNeedDialogOpen}
        setIsOfferDialogOpen={setIsOfferDialogOpen}
        setIsPopupOpen={setIsPopupOpen}
      />
    </div>
  );
};

export default MyWork;
