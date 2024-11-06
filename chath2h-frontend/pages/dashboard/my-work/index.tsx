import { useEffect, useMemo, useState } from 'react';
import styles from './myWork.module.scss';
import { useRouter } from 'next/router';
import AddButton from 'components/NeedsAndOffer/AddButton';
import classNames from 'classnames';
import CheckStatus from 'components/NeedsAndOffer/CheckStatus';
import MyWork from 'components/NeedsAndOffer/MyWork';
import { useMyNeedsAndOffers } from 'queries/needsAndOffersQuery';
import { Need, Offer, PageViewState, PageViewStateEnum } from 'globalTypes';
import EmptyMyWork from 'components/NeedsAndOffer/EmptyMyWork';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ProfileNav from 'components/ProfileNav';
import { useGlobalState } from 'globalState';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

const MyWorkPage = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [pageViewState, setPageViewState] = useState<PageViewState>(PageViewStateEnum.NEEDS);
  const isNeedPage = useMemo(() => pageViewState === PageViewStateEnum.NEEDS, [pageViewState]);
  const { data, error, status, refetch } = useMyNeedsAndOffers();
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');

  const activeData = useMemo(() => (isNeedPage ? data?.needs : data?.offers), [isNeedPage, data]);

  useEffect(() => {
    router.asPath.includes('#offers')
      ? setPageViewState(PageViewStateEnum.OFFERS)
      : setPageViewState(PageViewStateEnum.NEEDS);
  }, [router.asPath]);

  return (
    <div className={styles.container}>
      {user && (
        <div className={styles.profileNav}>
          <ProfileNav avatar={user.avatar} firstName={user.firstName} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.topMenu}>
          <div className={styles.buttons}>
            <button
              className={classNames(styles.button, isNeedPage && styles.needButton)}
              onClick={() => setPageViewState(PageViewStateEnum.NEEDS)}>
              {t('my-work_myNeeds')}
            </button>
            <button
              className={classNames(
                styles.button,
                pageViewState === PageViewStateEnum.OFFERS && styles.offerButton
              )}
              onClick={() => setPageViewState(PageViewStateEnum.OFFERS)}>
              {t('my-work_myOffers')}
            </button>
          </div>
          <Link
            className={classNames(styles.other, isNeedPage ? styles.red : styles.green)}
            href={isNeedPage ? '/needs' : '/offers'}>
            {t(isNeedPage ? 'my-work_other_needs' : 'my-work_other_offers')}
          </Link>
        </div>

        {activeData && activeData.length > 0 ? (
          <CheckStatus isData error={error} status={status}>
            <>
              <div className={styles.topTextButton}>
                <span className={styles.topText}>
                  {t(isNeedPage ? 'my-work_top_text_needs' : 'my-work_top_text_offers')}
                </span>
              </div>
              <div className={styles.workList}>
                {activeData.map((item: Need | Offer, index: number) => {
                  return (
                    <MyWork
                      isActive={item?.isActive}
                      refetch={refetch}
                      pageViewState={pageViewState}
                      key={item._id}
                      id={item._id}
                      image={'image' in item ? item?.image : item?.representativePhoto}
                      title={item.problemTitle}
                      description={item.description}
                      category={item.area.name}
                      areaId={item.area._id}
                      hashtags={item?.hashtags}
                      index={index}
                      hasChats={item?.chats && item.chats.length > 0}
                    />
                  );
                })}
              </div>
            </>
          </CheckStatus>
        ) : (
          <EmptyMyWork isNeed={isNeedPage} />
        )}
      </div>
    </div>
  );
};

export default MyWorkPage;
