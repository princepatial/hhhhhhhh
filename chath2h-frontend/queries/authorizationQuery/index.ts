import { useQuery } from '@tanstack/react-query';
import { NextRouter } from 'next/router';
import { getAuthMe, getAuthorization } from './authorization';

export const useAuthorization = (router: NextRouter, token?: string | string[]) =>
  useQuery(['authorization', token, router], async () => await getAuthorization(router, token), {
    enabled: !!token,
    initialData: null
  });

export const useAuthMe = () => useQuery(['authorizeMe'], async () => await getAuthMe());
