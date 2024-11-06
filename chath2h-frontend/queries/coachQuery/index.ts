import { useQuery } from '@tanstack/react-query';
import { CoachesWithCategories } from 'globalTypes';
import {
  getCoach,
  getTopCoaches,
  getAllCoaches,
  getRandomCoaches,
  getFavoriteCoaches
} from './coach';

export const useCoach = (id: string | string[] | undefined) =>
  useQuery<CoachesWithCategories | null>(['coach', id], async () => await getCoach(id), {
    initialData: null
  });

export const useCoaches = () =>
  useQuery(['coaches'], async () => await getAllCoaches(), {
    initialData: []
  });

export const useRandomCoaches = (ids: string[]) =>
  useQuery(['random-coaches', ids], async () => await getRandomCoaches(ids), {
    initialData: []
  });

export const useTopCoaches = () =>
  useQuery(['topCoaches'], async () => await getTopCoaches(), {
    initialData: []
  });

export const useFavoriteCoaches = () =>
  useQuery(['favorite-coaches'], async () => await getFavoriteCoaches(), {
    initialData: []
  });
