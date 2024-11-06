import { useInfiniteQuery } from '@tanstack/react-query';
import { getFilteredData } from './filter';
import {
  CoachPage,
  FilterDataType,
  FiltersCoach,
  FiltersNeedOffer,
  Need,
  Offer,
  PagePagination
} from 'globalTypes';
import { checkIfHasNextPage } from 'queries/helper';
import { getRandomCoaches } from 'queries/coachQuery/coach';

export const useFilteredData = (
  type: FilterDataType,
  limit: number,
  sort?: string | number,
  filters?: FiltersCoach | FiltersNeedOffer,
  usedCoaches?: string[]
) =>
  useInfiniteQuery<PagePagination<Need | Offer | CoachPage>, Error | null>(
    [`filtered-${type}`, limit, sort, filters],
    async ({ pageParam = 1 }) => {
      const filterData = await getFilteredData(type, limit, pageParam, sort, filters);
      if (usedCoaches) {
        const coaches = await getRandomCoaches(usedCoaches);
        filterData['coaches'] = coaches;
        return filterData;
      }
      return filterData;
    },
    {
      getNextPageParam: (lastPage) => checkIfHasNextPage(lastPage)
    }
  );
