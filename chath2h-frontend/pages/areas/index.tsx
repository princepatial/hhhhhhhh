import SingleArea from 'components/Categories/SingleArea';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useAreas } from 'queries/areaQuery';
import styles from './areas.module.scss';
import { useGlobalState } from 'globalState';
import Dialog from '@components/Dialog';
import { useEffect, useMemo, useState } from 'react';
import { AreaResponse } from 'globalTypes';
import Button from '@components/Button';
import AddEditCategoryForm from '@components/Categories/AddEditCategoryForm';
import useImageUrl from 'hooks/getImageUrl';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import HelpImg from '@images/help.png';
import CreateCoachProfile from 'components/CoachProfileForm';

const AreasPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isAdmin] = useGlobalState('isAdmin');
  const [isAddEditPopupOpen, setIsAddEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AreaResponse | null>(null);
  const { data: areasList, refetch: refetchAreas } = useAreas();
  const [currentAreasList, setCurrentAreasList] = useState<AreaResponse[]>([]);
  const { t, i18n } = useTranslation('common');
  const [isCoachProfile] = useGlobalState('isCoachProfile');
  const [user] = useGlobalState('user');
  const [isCreateCoachDialogOpen, setIsCreateCoachDialogOpen] = useState(false);

  const onSetItem = (item: AreaResponse) => {
    const imageSrc = useImageUrl(item.areaImage);
    setSelectedItem({ ...item, imageSrc });
  };

  const openEditPopup = (item: AreaResponse) => {
    setIsAddEditPopupOpen(true);
    onSetItem(item);
    setIsEdit(true);
  };

  const onClosePopup = () => {
    setIsAddEditPopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedItem(null);
    setIsEdit(false);
  };

  const openDeletePopup = (item: AreaResponse) => {
    setIsDeletePopupOpen(true);
    onSetItem(item);
  };

  const onDeleteArea = async () => {
    if (selectedItem) {
      try {
        const response = await axios.delete(`/areas/${selectedItem._id}`);
        if (response.status === 200) {
          toast.success(t('areas_delete_success'));
          refetchAreas();
        }
      } catch (error) {
        console.log(t('areas_delete_error'));
      } finally {
        setIsDeletePopupOpen(false);
      }
    }
  };

  const sortItemsByNames = (items: AreaResponse[]) =>
    items.sort(function (a, b) {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });

  const sortedCategories = useMemo(() => {
    if (!currentAreasList || currentAreasList.length < 1) return;

    const newList = currentAreasList?.map((area) => {
      const { name, translation } = area;
      const areaName = translation?.find((t) => t[i18n.language])?.[i18n.language] || name;
      return { ...area, translateName: areaName };
    });

    const indexItem = newList.findIndex((item) => item.name === 'other');
    if (indexItem > -1) {
      const splicedList = newList.splice(indexItem, indexItem);
      const list = [...newList, splicedList[0]];
      return list;
    }
    return sortItemsByNames(newList);
  }, [currentAreasList, i18n]);

  useEffect(() => {
    setCurrentAreasList(areasList);
  }, [areasList.length]);

  useEffect(() => {
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      send_to: 'G-GKZG9DYV69'
    });
  }, []);

  return (
    <div className={styles.container}>
      <Dialog
        isOpen={isAddEditPopupOpen}
        handleClose={onClosePopup}
        title={isEdit ? t('areas_edit_category') : t('areas_add_category')}>
        <AddEditCategoryForm
          onClose={onClosePopup}
          editValues={isEdit ? selectedItem : null}
          refetch={refetchAreas}
          onAddNewCategory={(newArea: AreaResponse) =>
            setCurrentAreasList([newArea, ...currentAreasList])
          }
        />
      </Dialog>
      <Dialog isOpen={isDeletePopupOpen} handleClose={onClosePopup}>
        <ConfirmPopup
          rightButtonEvent={onDeleteArea}
          leftButtonEvent={onClosePopup}
          subTitle={t('areas_delete_popup_subtitle')}
        />
      </Dialog>
      <Dialog
        isOpen={isCreateCoachDialogOpen}
        title={t('SingleArea_create_coach_profile')}
        handleClose={() => setIsCreateCoachDialogOpen(false)}>
        <div className={styles.coachProfileForm}>
          <CreateCoachProfile handleCancel={() => setIsCreateCoachDialogOpen(false)} />
        </div>
      </Dialog>
      <div className={styles.body}>
        <div className={styles.title}>
          {t('areas_header')}&nbsp;
          <div className={styles.buttons}>
            <Link href={'/help/categories'} className={styles.help}>
              <span>{t('areas_help_centre')}</span>&nbsp;
              <Image src={HelpImg} alt="help icon" width={19} height={19} />
            </Link>
            {isAdmin && (
              <Button
                buttonColor="whiteGreen"
                text={t('areas_add_button')}
                onClick={() => setIsAddEditPopupOpen(true)}
              />
            )}
            {!isCoachProfile && !!user && (
              <Button
                text={t('areas_add_coach_profile')}
                onClick={() => setIsCreateCoachDialogOpen(true)}
              />
            )}
          </div>
        </div>
        <div className={styles.subtitle}>
          {t('areas_choose_areas')}
          <div className={styles.second}>
            {t('areas_click')} <span className={styles.boldText}>{t('areas_need_help')} </span>
            {t('areas_get_help')}
            <span className={styles.boldText}> {t('areas_offer_help')}</span> {t('areas_want_help')}
          </div>
        </div>
        <div className={styles.areas}>
          {sortedCategories &&
            sortedCategories?.map((area) => {
              const { _id, areaImage, helpOffersCount, needOffersCount, translateName } = area;

              return (
                <SingleArea
                  setIsCreateCoachDialogOpen={setIsCreateCoachDialogOpen}
                  isCoachProfile={isCoachProfile}
                  openEditPopup={() => openEditPopup(area)}
                  id={_id}
                  key={_id}
                  name={translateName || ''}
                  helpOffersCount={helpOffersCount}
                  needOffersCount={needOffersCount}
                  filename={areaImage}
                  openDeletePopup={() => openDeletePopup(area)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
export default AreasPage;
