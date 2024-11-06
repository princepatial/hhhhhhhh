import { useQuery } from '@tanstack/react-query';
import { getSettings } from './settings';

export const useSettings = () =>
  useQuery(['settings'], async () => await getSettings(), {
    initialData: { backendURL: '', INACTIVITY_TIMEOUT: 0 }
  });
