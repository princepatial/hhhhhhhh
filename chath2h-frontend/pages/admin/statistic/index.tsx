import AdminLayout from '@components/AdminLayout';
import { usePlatformStatistic } from 'queries/statisticQuery';
import styles from './statistic.module.scss';
import { getName } from 'country-list';
import { languages, TLanguageCode } from 'countries-list';
import { StatisticCount, StatisticData } from 'globalTypes';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';
import Button from '@components/Button';

const sortArrayByName = (array: StatisticCount[]) =>
  array.sort((a, b) => {
    if (!a.name || !b.name || a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

enum StatisticNames {
  LANGUAGE = 'Language',
  COUNTRY = 'Country'
}

const Statistic = (_props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data } = usePlatformStatistic();
  const { t } = useTranslation('common');

  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'platform-statistic.json';

    link.click();
  };

  const filteredSortedData = useMemo(() => {
    if (!data) return null;
    return data.map((statisticData: StatisticData) => {
      const isLanguage = StatisticNames.LANGUAGE === statisticData.k;
      const country = StatisticNames.COUNTRY === statisticData.k;
      if (isLanguage || country) {
        statisticData.v.map((statisticCount) => {
          statisticCount.name = isLanguage
            ? languages[statisticCount._id as TLanguageCode]?.name
            : getName(statisticCount._id);
          return statisticCount;
        });

        sortArrayByName(statisticData.v);
      }
      return statisticData;
    });
  }, [data]);

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.listOfTables}>
          {filteredSortedData &&
            filteredSortedData.map((statisticData: StatisticData, indexParent: number) => {
              const title = statisticData.k.toLocaleLowerCase();
              const translateTitle = 'StatisticData_' + title;
              return (
                <table key={indexParent} className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t(translateTitle)}</th>
                      <th>{t('statistic_count')}</th>
                    </tr>
                  </thead>
                  <tbody className={styles.body}>
                    {statisticData.v.map((item, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{item?.name || item._id || t('statistic_not_selected')}</td>
                          <td>{item.count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              );
            })}
        </div>
        <div className={styles.buttonWrapper}>
          <Button onClick={exportData} text={t('statistic_export')} />
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});

export default Statistic;
