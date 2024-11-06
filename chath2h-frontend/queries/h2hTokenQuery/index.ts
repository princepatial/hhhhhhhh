import { useQuery } from '@tanstack/react-query';
import { getH2HToken } from './h2hToken';

export const useH2HToken = () =>
  useQuery(['h2hToken'], async () => await getH2HToken(), {
    initialData: {
      address: '',
      adminWalletAddress: '',
      startingAmount: '25000000000000000000',
    }
  });
