import Button from '@components/Button';
import Dialog from '@components/Dialog';
import PencilIconComponent from '@components/icons/pencil-bin-icon/pencil-icon.component';
import classNames from 'classnames';
import { useGlobalState } from 'globalState';
import { AdsLocation, Advertisement } from 'globalTypes';
import useImageUrl from 'hooks/getImageUrl';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useAds } from 'queries/adsQuery';
import { useState } from 'react';
import AddEditAdvertForm from '../AddEditAdvertForm';
import styles from './Nku.module.scss';

const Nku = ({ className }: { className?: string }) => {
  const [isAddEditPopupOpen, setIsAddEditPopupOpen] = useState(false);
  const [isAdmin] = useGlobalState('isAdmin');
  const { t } = useTranslation('common');
  const [selectedItem, setSelectedItem] = useState<Advertisement | null>(null);

  const { data: ads, refetch: refetchAds } = useAds(AdsLocation.NIKU);
  const nkuAd = ads && ads?.length > 0 ? ads[0] : null;

  const onSetItem = () => {
    if (!!nkuAd) {
      const imageSrc = useImageUrl(nkuAd.image.filename);
      setSelectedItem({ ...nkuAd, imageSrc });
    }
  };

  const openPopup = () => {
    setIsAddEditPopupOpen(true);
    onSetItem();
  };

  const onClosePopup = () => {
    setIsAddEditPopupOpen(false);
  };

  const image = !!nkuAd ? useImageUrl(nkuAd.image.filename) : undefined;
  const title = !!nkuAd ? t('Nku_edit_title') : t('Nku_add_title');

  return (
    <div className={styles.container}>
      <Dialog isOpen={isAddEditPopupOpen} handleClose={onClosePopup} title={title}>
        <AddEditAdvertForm
          isNiKU
          onClose={onClosePopup}
          editValues={selectedItem}
          location={AdsLocation.NIKU}
          refetchAds={refetchAds}
        />
      </Dialog>
      {isAdmin && !nkuAd && (
        <Button
          buttonColor="whiteGreen"
          text={t('Nku_add_button')}
          onClick={openPopup}
          style={styles.addNku}
        />
      )}
      {image && (
        <>
          <Link
            href={nkuAd?.redirectPath || ''}
            target="_blank"
            className={classNames(styles.nku, className)}>
            <Image
              src={image}
              alt="nku-advertisement"
              style={{ width: '100%', height: 'auto' }}
              className={classNames(isAdmin && styles.adminAdvert)}
              width="0"
              height="0"
              sizes="100vw"
            />
          </Link>
          {isAdmin && (
            <div className={styles.action}>
              <Button style={styles.iconButton} onClick={openPopup} buttonColor="whiteGreen">
                <PencilIconComponent />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nku;
