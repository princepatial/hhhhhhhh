import { useQuery } from '@tanstack/react-query';
import { getAreas } from './areas';

export const useAreas = () =>
  useQuery(['areasList'], async () => await getAreas(), {
    initialData: []
  });
