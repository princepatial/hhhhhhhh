import Button from '@components/Button';
import Dialog from '@components/Dialog';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import axios from 'axios';
import { useGlobalState } from 'globalState';
import { Advertisement as AdvertisementType, StateSetterType } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react';
import AddEditAdvertForm from '../AddEditAdvertForm';
import Advertisement from '../Advertisement';
import styles from './AdvertisementList.module.scss';
import useWindowDimensions from 'hooks/windowDimensions';
import CloseImg from '@images/close.png';
import Image from 'next/image';

type Props = {
  ads?: AdvertisementType[];
  location: string;
  refetchAds: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<AdvertisementType[] | null, unknown>>;
  setIsAdvertPopupOpen?: StateSetterType<boolean>;
};

const AdvertisementList = ({ ads = [], location, refetchAds, setIsAdvertPopupOpen }: Props) => {
  const [isAdmin] = useGlobalState('isAdmin');
  const [isAddEditPopupOpen, setIsAddEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdvertisementType | null>(null);
  const [items, setItems] = useState(ads);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const { t } = useTranslation('common');
  const [mobileCloseAdClicked, setMobileCloseAdClicked] = useState(false);

  const { width } = useWindowDimensions();

  const shuffleAd = (ads: AdvertisementType[]) => {
    return ads.sort(() => Math.random() - 0.5)[0];
  };

  const mobileCloseAdHandler = () => {
    setMobileCloseAdClicked(true);
    localStorage.setItem('mobile_ads_expiration_time', new Date().getTime().toString());
  };

  useEffect(() => {
    if (width >= 1200) {
      return setItems(ads);
    }
    const adsHideTimeout = localStorage.getItem('mobile_ads_expiration_time');
    const currentTime = new Date().getTime();
    const timeDifference = adsHideTimeout ? currentTime - parseInt(adsHideTimeout) : 0;
    const shouldHideAds = mobileCloseAdClicked || (adsHideTimeout && timeDifference < 7200000); // 2 hours

    if (shouldHideAds) {
      setMobileCloseAdClicked(true);
      setItems([]);
    } else {
      setItems([shuffleAd(ads)]);
    }
  }, [ads.length, mobileCloseAdClicked, width]);

  const onSetItem = (item: AdvertisementType) => {
    const imageSrc = useImageUrl(item.image.filename);
    setSelectedItem({ ...item, imageSrc });
  };

  const changeStatePopupOpen = (isOpen: boolean) => {
    if (!setIsAdvertPopupOpen) return;
    setIsAdvertPopupOpen(isOpen);
  };

  const openEditPopup = (item: AdvertisementType) => {
    setIsAddEditPopupOpen(true);
    changeStatePopupOpen(true);
    onSetItem(item);
    setIsEdit(true);
  };

  const openDeletePopup = (item: AdvertisementType) => {
    changeStatePopupOpen(true);
    setIsDeletePopupOpen(true);
    onSetItem(item);
  };

  const openAddPopup = () => {
    changeStatePopupOpen(true);
    setIsAddEditPopupOpen(true);
    setSelectedItem(null);
  };

  const onClosePopup = () => {
    changeStatePopupOpen(false);
    setIsAddEditPopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedItem(null);
    setIsEdit(false);
  };

  const onDeleteAdvert = async () => {
    if (selectedItem) {
      try {
        await axios.delete(`/advertisement/${selectedItem._id}`);
        refetchAds();
      } catch (error) {
        console.log(t('AdvertisementList_delete_error'));
      } finally {
        setIsDeletePopupOpen(false);
        changeStatePopupOpen(false);
      }
    }
  };

  const sendChangedItemPosition = async (id: string, dropPosition: number) => {
    try {
      const requestData = {
        id,
        position: dropPosition
      };
      const response = await axios.patch('/advertisement/position', { ...requestData });
      return response.data;
    } catch (error) {
      console.log(t('AdvertisementList_position_error'));
      return null;
    }
  };

  const onDragEnd = async () => {
    if (
      items &&
      dragItem.current !== null &&
      dragOverItem.current !== null &&
      dragItem.current !== dragOverItem.current
    ) {
      let adsCopy = [...items];

      //remove and save the dragged item content
      const draggedItemContent = adsCopy.splice(dragItem.current, 1)[0];
      //switch the position
      adsCopy.splice(dragOverItem.current, 0, draggedItemContent);
      sendChangedItemPosition(draggedItemContent._id, dragOverItem.current);
      //reset the position ref
      dragItem.current = null;
      dragOverItem.current = null;

      setItems(adsCopy);
      setIsDragging(false);
    }
  };

  const onDragStart = (index: number) => {
    dragItem.current = index;
  };

  const onDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  return (
    <div className={styles.advertisementBlock}>
      <Dialog
        isOpen={isAddEditPopupOpen}
        handleClose={onClosePopup}
        title={isEdit ? t('AdvertisementList_edit_advert') : t('AdvertisementList_add_advert')}>
        <AddEditAdvertForm
          onClose={onClosePopup}
          editValues={isEdit ? selectedItem : null}
          location={location}
          refetchAds={refetchAds}
        />
      </Dialog>
      <Dialog isOpen={isDeletePopupOpen} handleClose={onClosePopup}>
        <ConfirmPopup
          rightButtonEvent={onDeleteAdvert}
          leftButtonEvent={onClosePopup}
          subTitle={t('AdvertisementList_delete_popup_subtitle')}
        />
      </Dialog>
      <div className={styles.advertisement}>
        {!mobileCloseAdClicked && (
          <div className={styles.adsHeader}>
            <span className={styles.adsText}>{t('AdvertisementList_ads')}</span>
            {isAdmin && (
              <Button
                buttonColor="whiteGreen"
                text={t('AdvertisementList_add_button')}
                onClick={openAddPopup}
              />
            )}
            <Image
              className={styles.closeMobileButton}
              src={CloseImg}
              alt="close_button"
              width={15}
              height={15}
              onClick={mobileCloseAdHandler}
            />
          </div>
        )}

        <div className={styles.imageWrapper}>
          {items?.map((item, index) => {
            if (!item) return null;
            return (
              <div
                key={item._id}
                className={isDragging ? styles.dragging : ''}
                draggable
                onDragStart={() => (isAdmin ? onDragStart(index) : {})}
                onDragEnter={() => (isAdmin ? onDragEnter(index) : {})}
                onDragEnd={isAdmin ? onDragEnd : () => {}}
                onDragOver={(e) => e.preventDefault}>
                <Advertisement
                  name={item.name}
                  filename={item.image.filename}
                  id={item._id}
                  redirectPath={item.redirectPath}
                  openEditPopup={() => openEditPopup(item)}
                  openDeletePopup={() => openDeletePopup(item)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementList;
