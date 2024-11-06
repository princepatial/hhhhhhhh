import Button from '@components/Button';
import AddButton from '@components/NeedsAndOffer/AddButton';
import crossImage from '@images/cross.svg';
import FilterImage from '@images/filter.svg';
import searchIcon from '@images/magnifyingGlass.svg';
import classNames from 'classnames';
import { languages } from 'countries-list';
import {
  CoachPage,
  FilterDataType,
  FilterEnumType,
  FiltersCoach,
  FiltersNeedOffer,
  Need,
  Offer,
  PagePagination,
  SelectOptions,
  StateSetterType,
  gendersTranslate
} from 'globalTypes';
import { ageOptions, getLanguageOptions, getSelectOptions } from 'helpers';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAreas } from 'queries/areaQuery';
import { useFilteredData } from 'queries/filterQuery';
import { useEffect, useMemo, useRef, useState } from 'react';
import SelectComponent, { SingleValue, StylesConfig } from 'react-select';
import inputStyles from '../Inputs/FieldInput/FieldInput.module.scss';
import AllOptions from './AllOptions';
import styles from './CategoriesFilters.module.scss';
import itemStyles from './Item.module.scss';

const customStylesSelect: StylesConfig<SelectOptions> = {
  container: () => ({
    position: 'relative',
    background: 'white',
    borderRadius: '4px'
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
    justifyContent: 'space-between',
    minWidth: '105px'
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
    fontSize: '12px',
    wordBreak: 'break-word'
  })
};

const CheckStatus = ({
  error,
  status
}: {
  error: Error | null;
  status: 'error' | 'loading' | 'success';
}) => {
  switch (status) {
    case 'loading':
      return <p className={styles.statusText}>Loading data...</p>;
    case 'error':
      return <p className={styles.statusText}>Error {error && error.message}</p>;
    default:
      return null;
  }
};

type Props = {
  fetchNextPageCounter: number;
  setFilteredData: StateSetterType<Array<PagePagination<CoachPage | Need | Offer>> | null>;
  id?: string;
  type: FilterDataType;
  limit?: number;
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: StateSetterType<boolean>;
};

const CategoriesFilters = ({
  isMobileFilterOpen,
  setIsMobileFilterOpen,
  setFilteredData,
  fetchNextPageCounter,
  id,
  type,
  limit = 7
}: Props) => {
  const { t, i18n } = useTranslation('common');

  const sortOptions = [
    { label: t('CategoriesFilter_sort_option_all'), value: undefined },
    { label: t('CategoriesFilter_sort_option_desc'), value: -1 },
    { label: t('CategoriesFilter_sort_option_asc'), value: 1 }
  ];
  const allOption = { label: t('CategoriesFilter_sort_option_all'), value: undefined };

  const [category, setCategory] = useState<SingleValue<SelectOptions>>();
  const [language, setLanguage] = useState<SingleValue<SelectOptions>>();
  const [gender, setGender] = useState<SingleValue<SelectOptions>>();
  const [age, setAge] = useState<SingleValue<SelectOptions>>();
  const [newId, setNewId] = useState<string | undefined>(id);
  const [sort, setSort] = useState<SingleValue<SelectOptions> | undefined>(sortOptions[1]);
  const [name, setName] = useState<string>('');
  const [searchName, setSearchName] = useState<string | undefined>(undefined);
  const [usedCoaches, setUsedCoaches] = useState<string[]>([]);
  const { data: areasList } = useAreas();

  useEffect(() => {
    setNewId(id);
  }, [id]);

  const clearFilters = () => {
    setCategory(undefined);
    setLanguage(undefined);
    setGender(undefined);
    setName('');
    setNewId(undefined);
    setSearchName(undefined);
    setAge(undefined);
  };

  const getAreasOptions = () => {
    const areaList: { label: string; value: string | undefined }[] = areasList.map((data) => {
      const areaName =
        data.translation?.find((t) => t[i18n.language])?.[i18n.language] || data.name;
      return {
        label: areaName,
        value: data.name
      };
    });

    areaList.unshift(allOption);
    return areaList;
  };

  const languageOptions = useMemo(() => getLanguageOptions(languages, allOption), []);
  const genderOptions = useMemo(() => getSelectOptions(gendersTranslate, { t }, true), [t]);
  const areasOptions = useMemo(() => getAreasOptions(), [areasList?.length]);
  const filterAgeOptions = [allOption, ...ageOptions];

  const filters = useMemo(() => {
    const filtersData: FiltersCoach | FiltersNeedOffer =
      type === FilterEnumType.COACH
        ? {
            area: { name: category?.value },
            _id: newId,
            language: language?.value,
            gender: gender?.value,
            age: age?.range,
            firstName: searchName && searchName.length > 0 ? searchName : undefined
          }
        : {
            area: { name: category?.value },
            user: {
              language: language?.value,
              gender: gender?.value,
              age: age?.range,
              firstName: searchName && searchName.length > 0 ? searchName : undefined
            },
            _id: newId
          };

    // change selected value inside gender select component after changing the language
    if (gender?.value) {
      setGender(genderOptions.find((option) => option.value === gender.value));
    }

    return filtersData;
  }, [category, language, gender, age, newId, searchName, t]);

  const {
    data: filterData,
    error,
    fetchNextPage,
    status
  } = useFilteredData(
    type,
    limit,
    sort?.value,
    filters,
    type === FilterEnumType.NEED ? usedCoaches : undefined
  );

  const allOptions = [
    {
      options: sortOptions,
      setState: setSort,
      state: sort,
      text: t('CategoriesFilter_mobile_title_sorting')
    },
    {
      options: areasOptions,
      setState: setCategory,
      state: category,
      text: t('CategoriesFilter_mobile_title_category')
    },
    {
      options: languageOptions,
      setState: setLanguage,
      state: language,
      text: t('CategoriesFilter_mobile_title_language')
    },
    {
      options: genderOptions,
      setState: setGender,
      state: gender,
      text: t('CategoriesFilter_mobile_title_gender')
    },
    {
      options: filterAgeOptions,
      setState: setAge,
      state: age,
      text: t('CategoriesFilter_mobile_title_age')
    }
  ];

  useEffect(() => {
    if (filterData && filterData.pages) {
      setFilteredData(filterData.pages);
      setUsedCoaches([]);
    }
  }, [filterData, setFilteredData]);

  useEffect(() => {
    if (fetchNextPageCounter) {
      fetchNextPage();
    }
  }, [fetchNextPageCounter]);

  useEffect(() => {
    if (category?.value || language?.value || gender?.value || age?.value) {
      setNewId(undefined);
    }
  }, [category?.value, language?.value, gender?.value, age?.value]);

  useEffect(() => {
    const lastData = filterData?.pages[filterData.pages.length - 1];
    if (!lastData || !lastData?.coaches) return;
    const coaches = lastData.coaches.map((coach) => coach.user._id);

    setUsedCoaches([...usedCoaches, ...coaches]);
  }, [filterData, type]);

  const topButtonText = t(
    type === FilterEnumType.NEED ? `DetailsWrapper_add_need` : 'DetailsWrapper_add_offer'
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code.includes('Enter')) {
      setSearchName(name);
    }
  };

  return (
    <>
      <div className={styles.container}>
        {type === FilterEnumType.COACH && (
          <div className={styles.filterByName}>
            <span className={styles.textDesktop}>{t('CategoriesFilter_filter_by_name')}</span>
            <div className={classNames(inputStyles.container, styles.inputWrapper)}>
              <input
                className={classNames(inputStyles.input, styles.input)}
                placeholder={t('CategoriesFilter_filter_by_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={onKeyDown}
              />

              <button className={styles.button} onClick={() => setSearchName(name)}>
                <Image className={styles.icon} src={searchIcon} alt="searchIcon" />
              </button>
            </div>
          </div>
        )}
        <div
          className={classNames(
            styles.filtersMobile,
            type === FilterEnumType.COACH ? styles.filtersCoach : styles.filtersNeedOffer
          )}>
          <Button
            style={styles.filterButton}
            buttonColor="whiteGreen"
            text="Filters"
            onClick={() => setIsMobileFilterOpen(true)}>
            <div className={styles.image}>
              <Image alt="filter image" src={FilterImage} fill />
            </div>
          </Button>
          {type !== FilterEnumType.COACH && (
            <div className={styles.addOffer}>
              <AddButton text={topButtonText} color={'whiteRed'} />
            </div>
          )}
          {isMobileFilterOpen && (
            <div className={styles.filters}>
              <div
                className={classNames(
                  itemStyles.item,
                  itemStyles.backgroundSilver,
                  itemStyles.title
                )}>
                <span className={itemStyles.textBold}>{t('CategoriesFilters_filters')}</span>
                <div onClick={() => setIsMobileFilterOpen(false)} className={itemStyles.image}>
                  <Image src={crossImage} alt="cross image" fill />
                </div>
              </div>
              <div
                className={itemStyles.item}>
                <Button
                    onClick={() => {
                      clearFilters();
                      setIsMobileFilterOpen(false);
                    }}
                    buttonColor="whiteGreen"
                    style={styles.button}
                    text={t('CategoriesFilters_clear-filters')}
                />
                <Button
                    onClick={() => setIsMobileFilterOpen(false)}
                    style={styles.button}
                    text={t('CategoriesFilters_mobile_aplly_filters')}
                />
              </div>
              {allOptions.map((item, index) => (
                <AllOptions
                  key={index}
                  options={item.options}
                  stateItem={item.state}
                  setStateItem={item.setState}
                  text={item.text}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.filtersWrapper}>
          <div className={styles.filters}>
            <span>{t('CategoriesFilter_filter_by_title')}</span>
            <div className={styles.label}>
              <SelectComponent
                isMulti={false}
                placeholder={t('CategoriesFilter_filter_by_category')}
                aria-labelledby="category"
                value={category || null}
                onChange={(e) => setCategory(e as SingleValue<SelectOptions>)}
                options={areasOptions}
                classNamePrefix="Select"
                styles={customStylesSelect}
              />
            </div>
            <SelectComponent
              isMulti={false}
              placeholder={t('CategoriesFilter_filter_by_language')}
              aria-labelledby="language"
              value={language || null}
              onChange={(e) => setLanguage(e as SingleValue<SelectOptions>)}
              options={languageOptions}
              classNamePrefix="Select"
              styles={customStylesSelect}
            />
            <SelectComponent
              isMulti={false}
              placeholder={t('CategoriesFilter_filter_by_gender')}
              aria-labelledby="gender"
              value={gender || null}
              onChange={(e) => setGender(e as SingleValue<SelectOptions>)}
              options={genderOptions}
              classNamePrefix="Select"
              styles={customStylesSelect}
            />
            <SelectComponent
              isMulti={false}
              placeholder={t('CategoriesFilter_filter_by_age')}
              aria-labelledby="age"
              value={age || null}
              onChange={(e) => setAge(e as SingleValue<SelectOptions>)}
              options={filterAgeOptions}
              classNamePrefix="Select"
              styles={customStylesSelect}
            />
          </div>
          <div className={styles.sort}>
            <span>{t('CategoriesFilter_sort_by_title')}</span>
            <SelectComponent
              isMulti={false}
              placeholder=""
              aria-labelledby="sort"
              value={sort}
              onChange={(e) => setSort(e as SingleValue<SelectOptions>)}
              options={sortOptions}
              classNamePrefix="Select"
              styles={customStylesSelect}
            />
          </div>
          <div className={styles.buttonWrapper}>
            <span className={styles.reset} onClick={clearFilters}>
              {t('CategoriesFilter_clear')}
            </span>
          </div>
        </div>
      </div>

      <CheckStatus error={error} status={status} />
    </>
  );
};

export default CategoriesFilters;
