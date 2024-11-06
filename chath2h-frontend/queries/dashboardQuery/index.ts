import { useQuery } from '@tanstack/react-query';
import { getDashboard } from './dashboard';
import { DashboardType } from 'globalTypes';

export const useDashboard = () =>
  useQuery<DashboardType | null>(['dashboard'], async () => await getDashboard(), {
    initialData: null
  });
