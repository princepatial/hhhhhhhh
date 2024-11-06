import { useQuery } from '@tanstack/react-query';
import { getAdminAds, getAds } from './ads';
import { AdsLocationType, Advertisement } from 'globalTypes';

export const useAds = (type?: AdsLocationType) =>
  useQuery<Advertisement[] | null>(['ads', type], async () => await getAds(type), {
    initialData: null
  });

export const useAdminAds = () =>
  useQuery<Advertisement[] | null>(['admin-ads'], async () => await getAdminAds(), {
    initialData: null
  });
