import Dialog from '@components/Dialog';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import {
  HelpFormValues,
  MyNeedsAndOffers,
  SingleNeedOffer,
  StateSetterType,
  StepOfferForm
} from 'globalTypes';
import { useTranslation } from 'next-i18next';
import { updateNeed } from 'queries/needQuery/need';
import { updateOffers } from 'queries/offerQuery/offer';
import { useLoadingTrackerForList } from 'hooks/useLoadingTracker';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import { removeNeedOrOffer } from 'queries/needsAndOffersQuery/needsAndOffersQuery';
import { toast } from 'react-toastify';
import HelpForm from '@components/Categories/HelpForm';
import { useEffect, useState } from 'react';
import { CalendarProps } from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import CalendarForm from '@components/Categories/CalendarForm';

type Props = {
  isPopupOpen: boolean;
  setIsPopupOpen: StateSetterType<boolean>;
  isPopupStateResolved: boolean;
  isActive?: boolean;
  isNeed: boolean;
  id: string;
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult<MyNeedsAndOffers | SingleNeedOffer | null, Error | null>>;

  setIsNeedDialogOpen: StateSetterType<boolean>;
  isNeedDialogOpen: boolean;
  areaId?: string;
  editValues: HelpFormValues;
  setIsOfferDialogOpen: StateSetterType<boolean>;
  availableFrom?: Date;
  isOfferDialogOpen: boolean;
  onDeleteSinglePage?: () => void;
  onResolvedDelete?: (isDelete?: boolean) => void;
};

const CrudOfferNeed = ({
  isOfferDialogOpen,
  isPopupOpen,
  setIsPopupOpen,
  isPopupStateResolved,
  isActive,
  isNeed,
  id,
  refetch,
  setIsNeedDialogOpen,
  isNeedDialogOpen,
  editValues,
  areaId,
  setIsOfferDialogOpen,
  availableFrom,
  onDeleteSinglePage,
  onResolvedDelete
}: Props) => {
  const { t } = useTranslation('common');
  const { ltrack, loadingData } = useLoadingTrackerForList();
  const [step, setStep] = useState<StepOfferForm>(StepOfferForm.FORM);
  const [offerFormValues, setOfferFormValues] = useState<HelpFormValues>();
  const [date, setDate] = useState<Value>((availableFrom && new Date(availableFrom)) || new Date());
  const [canChangeDate, setCanChangeDate] = useState(true);

  const deleteItem = ltrack('delete', async () => {
    if (loadingData.delete) return;
    try {
      await removeNeedOrOffer(id, isNeed);
      toast.success(t(`MyWork_toast_success_delete_${isNeed ? 'need' : 'offer'}`));
    } catch (err) {
      toast.error(t(`MyWork_toast_error_delete_${isNeed ? 'need' : 'offer'}`));
    } finally {
      isOfferDialogOpen && setIsOfferDialogOpen(false);
      isNeedDialogOpen && setIsNeedDialogOpen(false);
      setIsPopupOpen(false);
      onDeleteSinglePage ? onDeleteSinglePage() : refetch();
    }
  });

  const onResolved = ltrack('resolved', async () => {
    if (loadingData.resolved) return;

    const response = isNeed
      ? await updateNeed(id, { hashtags: editValues.hashtags, isActive: !isActive }, true)
      : await updateOffers(id, { hashtags: editValues.hashtags, isActive: !isActive }, true);
    if (response) {
      setIsPopupOpen(false);
      refetch();
    }
  });

  const onCloseDialogNeed = () => setIsNeedDialogOpen(false);
  const handleNeedSubmit = ltrack('need', async (values: HelpFormValues) => {
    if (loadingData.need) return;
    let requestData = {
      image: typeof values.image === 'string' ? undefined : values.image,
      description: values.description,
      problemTitle: values.title,
      hashtags: values.hashtags,
      area: areaId
    };

    try {
      const registerResponse = await updateNeed(id, requestData);

      if (registerResponse) {
        toast.success(t('MyWork_edit_need_success'));
        onCloseDialogNeed();
        refetch();
      }
    } catch (err) {
      console.log(err);
      toast.error(t('MyWork_edit_need_error'));
    }
  });

  const onCloseDialogOffer = () => setIsOfferDialogOpen(false);

  const handleOfferSubmit = async (data?: HelpFormValues) => {
    if (!data) return;

    let requestData = {
      representativePhoto: typeof data.image === 'string' ? undefined : data.image,
      description: data.description,
      problemTitle: data.title,
      hashtags: data.hashtags,
      area: areaId,
      newOfferDate: date
    };

    try {
      const registerResponse = await updateOffers(id, requestData);
      if (registerResponse) {
        setStep(StepOfferForm.FORM);
        toast.success(t('MyWork_edit_offer_success'));
        onCloseDialogOffer();
        refetch();
      }
    } catch (err) {
      toast.error(t('MyWork_edit_offer_error'));
    }
  };

  const handleOfferCalendar = ltrack('calendar', async () => {
    if (loadingData.calendar) return;
    await handleOfferSubmit(offerFormValues);
  });
  const handleOfferHelpForm = ltrack('helpForm', async (values: HelpFormValues) => {
    if (loadingData.helpForm) return;
    await handleOfferSubmit(offerFormValues || values);
  });

  const onNextClick = async (values: HelpFormValues) => {
    setOfferFormValues(values);
    setStep(StepOfferForm.CALENDAR);
  };

  const onDateChange: CalendarProps['onChange'] = (date) => {
    setDate(date);
  };

  useEffect(() => {
    if (date && date < new Date()) {
      setCanChangeDate(false);
    }
  }, [date]);

  const deleteResolvedData = {
    onResolvedDelete,
    isActive: isActive || false,
    isNeed
  };

  return (
    <>
      <Dialog
        isOpen={isNeedDialogOpen}
        handleClose={onCloseDialogNeed}
        isOtherPopupOpen={isPopupOpen}
        title={t('SingleArea_define_problem')}>
        <HelpForm
          deleteResolvedData={deleteResolvedData}
          isButtonDisabled={loadingData.need}
          editValues={editValues}
          handleSubmit={handleNeedSubmit}
          isNeedForm
          buttonText={t('SingleArea_confirm')}
          onClose={onCloseDialogNeed}
          helpTitle={t('SingleArea_problem_title')}
          helpDescriptionPlaceholder={t('SingleArea_describe_problem')}
        />
      </Dialog>
      <Dialog
        isOpen={isOfferDialogOpen}
        handleClose={onCloseDialogOffer}
        isOtherPopupOpen={isPopupOpen}
        title={
          step === StepOfferForm.FORM
            ? t('SingleArea_create_help_offer')
            : t('SingleArea_when_start_help')
        }>
        <>
          {step === StepOfferForm.FORM ? (
            <HelpForm
              deleteResolvedData={deleteResolvedData}
              isButtonDisabled={loadingData.helpForm}
              editValues={editValues}
              handleSubmit={canChangeDate ? onNextClick : handleOfferHelpForm}
              buttonText={canChangeDate ? t('SingleArea_choose_date') : t('SingleArea_confirm')}
              onClose={onCloseDialogOffer}
              helpTitle={t('SingleArea_offer_title')}
              helpDescriptionPlaceholder={t('SingleArea_how_can_help')}
            />
          ) : null}
          {step === StepOfferForm.CALENDAR ? (
            <CalendarForm
              isButtonDisabled={loadingData.calendar}
              handleSubmit={handleOfferCalendar}
              onBackClick={() => setStep(StepOfferForm.FORM)}
              date={date}
              onDateChange={onDateChange}
            />
          ) : null}
        </>
      </Dialog>
      <Dialog isOpen={isPopupOpen} handleClose={() => setIsPopupOpen(false)}>
        <ConfirmPopup
          disabledRight={isPopupStateResolved ? loadingData.resolved : loadingData.delete}
          rightButtonEvent={() => (isPopupStateResolved ? onResolved() : deleteItem())}
          leftButtonEvent={() => setIsPopupOpen(false)}
          subTitle={
            isPopupStateResolved
              ? t(isActive ? 'MyWork_subTitle_resolved' : 'MyWork_subTitle_active')
              : t(`MyWork_confirm_delete_${isNeed ? 'need' : 'offer'}_popup`)
          }
          rightButton={
            isPopupStateResolved
              ? t(isActive ? 'MyWork_rightButton_resolved' : 'MyWork_button_active')
              : undefined
          }
          leftButtonColor={isPopupStateResolved ? 'green' : 'red'}
          rightButtonColor={isPopupStateResolved ? 'whiteGreen' : 'grey'}
        />
      </Dialog>
    </>
  );
};

export default CrudOfferNeed;
