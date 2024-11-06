import { useQuery } from '@tanstack/react-query';
import { getStatistic } from './statistic';
import { StatisticData } from 'globalTypes';

export const usePlatformStatistic = () =>
  useQuery<StatisticData[] | null>(['statistic'], async () => await getStatistic(), {
    initialData: null
  });
