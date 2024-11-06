import Nku from '@components/Advertisement/Nku';
import BuyNewTokensPopup from '@components/Popups/BuyNewTokensPopup';
import classNames from 'classnames';
import AdvertisementList from 'components/Advertisement/AdvertisementList';
import Button from 'components/Button';
import CheckStatus from 'components/NeedsAndOffer/CheckStatus';
import ProfileNav from 'components/ProfileNav';
import dayjs from 'dayjs';
import { useGlobalState } from 'globalState';
import {
  AdsLocation,
  SelectOptions,
  TokenTransactionKind,
  TokensTransaction,
  tokenTransactionTypeTranslate
} from 'globalTypes';
import { getSelectOptions } from 'helpers';
import useIsInViewport from 'hooks/isInViewport';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useAds } from 'queries/adsQuery';
import { useFilteredTokens } from 'queries/tokensQuery';
import { useEffect, useMemo, useRef, useState } from 'react';
import SelectComponent, { MultiValue, SingleValue, StylesConfig } from 'react-select';
import { toast } from 'react-toastify';
import styles from './my-tokens.module.scss';
import useCheckAdvertHeight from 'hooks/useCheckAdvertHeight';

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

const customStylesSelect: StylesConfig<SelectOptions> = {
  container: () => ({
    position: 'relative',
    background: 'white',
    width: '153px'
  }),
  control: () => ({
    padding: '2px 0 0 14px',
    cursor: 'pointer',
    fontWeight: 400,
    display: 'flex',
    fontFamily: 'inherit',
    minHeight: '36px',
    borderRadius: '4px',
    background: '#fff',
    fontSize: '12px',
    justifyContent: 'space-between'
  }),
  indicatorSeparator: () => ({
    width: 0
  }),
  input: () => ({
    position: 'absolute'
  }),
  valueContainer: () => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    width: '100%'
  }),
  singleValue: () => ({
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap'
  }),
  clearIndicator: () => ({
    display: 'none'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: '#39aba4',
    padding: '4px'
  }),
  menu: () => ({
    background: '#f9f9f9',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    fontSize: '12px'
  })
};

const MyTokens = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation('common');
  const [user] = useGlobalState('user');
  const router = useRouter();

  const typeOptions = useMemo(
    () => getSelectOptions(tokenTransactionTypeTranslate, { t }, true),
    [t]
  );
  const [type, setType] = useState<SingleValue<SelectOptions>>(typeOptions[0]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [observer, setObserver] = useState<HTMLDivElement | null>(null);
  const fetchNextPageTrigger = useIsInViewport(observer);

  const { data, fetchNextPage, error, status } = useFilteredTokens(
    7,
    type && 'value' in type && typeof type?.value === 'string' ? type.value : undefined
  );
  const { data: ads, refetch: refetchAds } = useAds(AdsLocation.MY_TOKENS);
  const adsList = useMemo(() => ads?.filter((ad) => ad.location === AdsLocation.MY_TOKENS), [ads]);

  const refAdvert = useRef<HTMLDivElement | null>(null);
  const isAdvertHigherThanWindow = useCheckAdvertHeight(refAdvert);

  useEffect(() => {
    if (fetchNextPageTrigger) {
      fetchNextPage();
      if (router.query.status) {
        if (router.query.status == 'success') {
          toast.success(t('my-tokens_payment_success'));
        } else {
          toast.error(t('my-tokens_payment_error'));
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [fetchNextPageTrigger]);

  useEffect(() => {
    if (type?.value) {
      const translatedType = typeOptions.find((option) => option.value === type.value);
      if (translatedType) setType(translatedType);
    }
  }, [t, typeOptions.length, type?.value]);

  if (!user) return;

  return (
    <div className={styles.container}>
      {user && (
        <ProfileNav avatar={user.avatar} firstName={user.firstName} style={styles.profile} />
      )}
      <div className={styles.mainContent}>
        <div className={styles.topData}>
          <div className={styles.tokensTitle}>
            <span className={styles.title}>{t('my-tokens_title')}</span>
            <span className={styles.tokens}>{user.tokens?.toFixed() || 0} H2H</span>
          </div>
          <BuyNewTokensPopup
            title={t('my-tokens_dialog_title')}
            rightButtonText={t('my-tokens_dialog_button_text')}
            isOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
          <Button
            onClick={() => setIsDialogOpen(true)}
            style={styles.button}
            text={t('my-tokens_button_text')}
            buttonColor="green"
          />
        </div>
        <div className={styles.tokensListTitle}>
          <span className={styles.title}>{t('my-tokens_transaction_history')}</span>
          <div className={styles.filter}>
            <span className={styles.type}>{t('my-tokens_type_of_transaction')}</span>
            <SelectComponent
              isMulti={false}
              aria-labelledby="type"
              value={type}
              onChange={(item) => setType(item as SingleValue<SelectOptions>)}
              options={typeOptions}
              classNamePrefix="Select"
              styles={customStylesSelect}
            />
          </div>
        </div>
        <div className={styles.list}>
          {data?.pages.map(
            (page) =>
              page?.docs.length > 0 &&
              page?.docs.map((item: TokensTransaction, index: number) => {
                const itemName =
                  item.type.toLowerCase() == 'chat'
                    ? `${
                        item.kind === TokenTransactionKind.CREDIT ? 'earn' : 'spent'
                      }_${item.type.toLowerCase()}`
                    : item.type.toLowerCase();
                const title = t(`my-tokens_${itemName}_title`);
                const text = t(`my-tokens_${itemName}_text`);
                return (
                  <div className={styles.item} key={index}>
                    <div className={styles.textWrapper}>
                      <span className={styles.title}>{title}</span>
                      <span className={styles.text}>{text}</span>
                    </div>
                    <div className={styles.dateWithBalance}>
                      <span className={styles.date}>
                        {dayjs(item.createdAt).format('DD.MM.YYYY')}
                      </span>
                      <span className={classNames(styles.balance, styles[itemName || ''])}>
                        {(item.kind === TokenTransactionKind.CREDIT ? '+' : '-') +
                          ' ' +
                          item.amount +
                          ' ' +
                          'H2H'}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
          <CheckStatus error={error} status={status} isData={!!data} />
        </div>
        <div ref={setObserver}></div>
      </div>
      <div
        ref={refAdvert}
        className={classNames(
          styles.advertisement,
          isAdvertHigherThanWindow ? styles.flexEnd : styles.flexStart
        )}>
        <Nku className={styles.nku} />
        <AdvertisementList
            ads={adsList}
            location={AdsLocation.MY_TOKENS}
            refetchAds={refetchAds}
          />
      </div>
    </div>
  );
};

export default MyTokens;
