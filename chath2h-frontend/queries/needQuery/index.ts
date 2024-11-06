import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Need, PagePagination } from 'globalTypes';
import { checkIfHasNextPage } from 'queries/helper';
import { getNeedDetails, getNeeds } from './need';

export const useNeedDetails = (id: string | string[] | undefined) =>
  useQuery<Need | null, Error | null>(['need', id], async () => await getNeedDetails(id), {
    enabled: !!id,
    initialData: null
  });

export const useNeeds = () => {
  const {
    data: needList,
    error,
    fetchNextPage,
    status
  } = useInfiniteQuery<PagePagination<Need>, Error | null>(
    ['needs'],
    async ({ pageParam = 1 }) => await getNeeds(pageParam),
    {
      getNextPageParam: (lastPage) => checkIfHasNextPage(lastPage)
    }
  );
  return { needList, error, fetchNextPage, status };
};
