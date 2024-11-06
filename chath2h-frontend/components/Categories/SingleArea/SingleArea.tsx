import { TrashBinIconComponent } from '@components/icons';
import PencilIconComponent from '@components/icons/pencil-bin-icon/pencil-icon.component';
import axios from 'axios';
import classNames from 'classnames';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import { useGlobalState } from 'globalState';
import { HelpFormValues, StateSetterType, StepOfferForm } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import { useLoadingTrackerForList } from 'hooks/useLoadingTracker';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import router from 'next/router';
import { MouseEventHandler, useState } from 'react';
import { CalendarProps } from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import CalendarForm from '../CalendarForm';
import HelpForm from '../HelpForm';
import styles from './SingleArea.module.scss';

type AreaContentProps = {
  isUserUnLogged: boolean;
  needsCount: number;
  offersCount: number;
  onNeedHelp: MouseEventHandler<HTMLButtonElement>;
  onOfferHelp: MouseEventHandler<HTMLButtonElement>;
  openEditPopup?: () => void;
  openDeletePopup?: MouseEventHandler<HTMLButtonElement>;
};

const AreaContent = ({
  isUserUnLogged,
  needsCount,
  offersCount,
  onNeedHelp,
  onOfferHelp,
  openEditPopup,
  openDeletePopup
}: AreaContentProps) => {
  const [isAdmin] = useGlobalState('isAdmin');
  const { t } = useTranslation('common');
  return (
    <div
      className={classNames(
        styles.buttons,
        isMobile ? styles.mobileButtons : styles.desktopButtons
      )}>
      {isAdmin && !isMobile && (
        <div className={styles.action}>
          <Button style={styles.iconButton} onClick={openEditPopup} buttonColor="whiteGreen">
            <PencilIconComponent />
          </Button>
          <Button style={styles.iconButton} onClick={openDeletePopup} buttonColor="whiteRed">
            <TrashBinIconComponent />
          </Button>
        </div>
      )}
      <div className={styles.need}>
        <Button
          text={t('SingleArea_need_help')}
          buttonColor="red"
          style={classNames(
            styles.small_button,
            isMobile ? styles.mobileButton : styles.desktopButton
          )}
          disabled={isUserUnLogged}
          onClick={onNeedHelp}
        />
        <span>
          {needsCount} {t('SingleArea_registered')}
        </span>
      </div>
      <div className={styles.offer}>
        <Button
          buttonColor="limeGreen"
          text={t('SingleArea_offer_help')}
          style={classNames(
            styles.small_button,
            isMobile ? styles.mobileButton : styles.desktopButton
          )}
          disabled={isUserUnLogged}
          onClick={onOfferHelp}
        />
        <span>
          {offersCount} {t('SingleArea_registered')}
        </span>
      </div>
    </div>
  );
};

type Props = {
  id: string;
  name: string;
  filename: string;
  helpOffersCount: number;
  needOffersCount: number;
  openEditPopup: () => void;
  openDeletePopup: MouseEventHandler<HTMLButtonElement>;
  isCoachProfile: boolean;
  setIsCreateCoachDialogOpen: StateSetterType<boolean>;
};

const SingleArea = ({
  id,
  name,
  filename,
  helpOffersCount,
  needOffersCount,
  openEditPopup,
  openDeletePopup,
  isCoachProfile,
  setIsCreateCoachDialogOpen
}: Props) => {
  const [isNeedDialogOpen, setIsNeedDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isMobileAreaContentOpen, setIsMobileAreaContentOpen] = useState(false);
  const [step, setStep] = useState<StepOfferForm>(StepOfferForm.FORM);
  const [offerFormValues, setOfferFormValues] = useState<HelpFormValues>();
  const [date, setDate] = useState<Value>(new Date());
  const [isUserLogged] = useGlobalState('isUserLogged');
  const [isAdmin] = useGlobalState('isAdmin');
  const [addedOfferCount, setAddedOfferCount] = useState(0);
  const [addedNeedCount, setAddedNeedCount] = useState(0);
  const { t } = useTranslation('common');
  const { ltrack, loadingData } = useLoadingTrackerForList();
  const image = useImageUrl(filename);

  const onOfferHelp = () => {
    if (!isUserLogged) return;
    if (!isCoachProfile) {
      setIsCreateCoachDialogOpen(true);
    } else {
      setIsOfferDialogOpen(true);
    }
    setIsMobileAreaContentOpen(false);
  };

  const onNeedHelp = () => {
    setIsNeedDialogOpen(true);
    setIsMobileAreaContentOpen(false);
  };

  const onCloseDialogNeed = () => {
    setIsNeedDialogOpen(false);
  };

  const onCloseDialogOffer = () => {
    setIsOfferDialogOpen(false);
  };

  const onOpenMobileAreaContent = () => {
    setIsMobileAreaContentOpen(true);
  };

  const onNextClick = async (values: HelpFormValues) => {
    setStep(StepOfferForm.CALENDAR);
    setOfferFormValues(values);
  };

  const onDateChange: CalendarProps['onChange'] = (date) => {
    setDate(date);
  };

  const handleNeedSubmit = ltrack('need', async (values: HelpFormValues) => {
    if (loadingData.need) return;
    let requestData = {
      image: values.image,
      description: values.description,
      problemTitle: values.title,
      hashtags: values.hashtags,
      area: id
    };

    try {
      const registerResponse = await axios.post('/needs', requestData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (registerResponse) {
        setAddedNeedCount((prevState) => prevState + 1);
        toast.success(t('SingleArea_problem_added'));
        onCloseDialogNeed();
        router.push('/dashboard/my-work');
      }
    } catch (err) {
      toast.error(t('SingleArea_problem_add_error'));
      console.log(err);
    }
  });

  const handleOfferSubmit = ltrack('offer', async (e: React.MouseEvent<HTMLElement>) => {
    if (loadingData.offer) return;
    e.preventDefault();
    if (offerFormValues) {
      let requestData = {
        representativePhoto: offerFormValues.image,
        description: offerFormValues.description,
        problemTitle: offerFormValues.title,
        hashtags: offerFormValues.hashtags,
        area: id,
        availableFrom: date
      };

      try {
        const registerResponse = await axios.post('coach-offer', requestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (registerResponse) {
          setAddedOfferCount((prevState) => prevState + 1);
          setStep(StepOfferForm.FORM);
          toast.success(t('SingleArea_offer_added'));
          onCloseDialogOffer();
          router.push('/dashboard/my-work?#offers');
        }
      } catch (err) {
        toast.error(t('SingleArea_offer_add_error'));
        console.log(err);
      }
    }
  });

  return (
    <div className={styles.container}>
      <Dialog
        isOpen={isNeedDialogOpen}
        handleClose={onCloseDialogNeed}
        title={t('SingleArea_define_problem')}>
        <HelpForm
          handleSubmit={handleNeedSubmit}
          isNeedForm
          buttonText={t('SingleArea_confirm')}
          onClose={onCloseDialogNeed}
          helpTitle={t('SingleArea_problem_title')}
          helpSubTitle={t('SingleArea_max_50_char')}
          helpDescriptionPlaceholder={t('SingleArea_problem_placeholder')}
          isButtonDisabled={loadingData.need}
        />
      </Dialog>
      <Dialog
        isOpen={isOfferDialogOpen}
        handleClose={onCloseDialogOffer}
        title={
          step === StepOfferForm.FORM
            ? t('SingleArea_create_help_offer')
            : t('SingleArea_when_start_help')
        }>
        <>
          {step === StepOfferForm.FORM ? (
            <HelpForm
              editValues={offerFormValues}
              handleSubmit={onNextClick}
              buttonText={t('SingleArea_choose_date')}
              onClose={onCloseDialogOffer}
              helpTitle={t('SingleArea_offer_title')}
              helpDescriptionPlaceholder={t('SingleArea_how_can_help')}
            />
          ) : null}
          {step === StepOfferForm.CALENDAR ? (
            <CalendarForm
              handleSubmit={handleOfferSubmit}
              onBackClick={() => setStep(StepOfferForm.FORM)}
              date={date}
              onDateChange={onDateChange}
              isButtonDisabled={loadingData.offer}
            />
          ) : null}
        </>
      </Dialog>
      <div className={styles.singleBox}>
        {!isUserLogged ? (
          <Tooltip anchorSelect=".my-anchor-element" place="top" className={styles.tooltip}>
            {t('SingleArea_login_first')}
          </Tooltip>
        ) : null}
        <div
          className={classNames(styles.area, 'my-anchor-element')}
          data-tooltip-delay-show={0}
          data-tooltip-delay-hide={0}>
          <Image
            alt="at home"
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className={isMobile ? styles.imageMobile : styles.image}
            onClick={isMobile ? onOpenMobileAreaContent : () => {}}
          />
          {isMobile ? (
            <>
              <Dialog
                isOpen={isMobileAreaContentOpen}
                handleClose={() => setIsMobileAreaContentOpen(false)}>
                <AreaContent
                  needsCount={
                    addedNeedCount > 0 ? addedNeedCount + needOffersCount : needOffersCount
                  }
                  offersCount={
                    addedOfferCount > 0 ? addedOfferCount + helpOffersCount : helpOffersCount
                  }
                  isUserUnLogged={!isUserLogged}
                  onNeedHelp={onNeedHelp}
                  onOfferHelp={onOfferHelp}
                />
              </Dialog>
              <>
                {isAdmin && (
                  <div className={styles.action}>
                    <Button
                      style={styles.iconButton}
                      onClick={openEditPopup}
                      buttonColor="whiteGreen">
                      <PencilIconComponent />
                    </Button>
                    <Button
                      style={styles.iconButton}
                      onClick={openDeletePopup}
                      buttonColor="whiteRed">
                      <TrashBinIconComponent />
                    </Button>
                  </div>
                )}
              </>
            </>
          ) : (
            <AreaContent
              needsCount={addedNeedCount > 0 ? addedNeedCount + needOffersCount : needOffersCount}
              offersCount={
                addedOfferCount > 0 ? addedOfferCount + helpOffersCount : helpOffersCount
              }
              isUserUnLogged={!isUserLogged}
              onNeedHelp={onNeedHelp}
              onOfferHelp={onOfferHelp}
              openEditPopup={openEditPopup}
              openDeletePopup={openDeletePopup}
            />
          )}
        </div>
        <span className={styles.name}>{name}</span>
      </div>
    </div>
  );
};

export default SingleArea;
