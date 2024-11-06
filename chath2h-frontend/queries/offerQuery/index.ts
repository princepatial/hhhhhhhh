import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Offer, PagePagination } from 'globalTypes';
import { getOffer, getOffers } from './offer';
import { checkIfHasNextPage } from 'queries/helper';

export const useOffer = (id: string | string[] | undefined) =>
  useQuery<Offer | null>(['offer', id], async () => await getOffer(id), {
    enabled: !!id,
    initialData: null
  });

export const useOffers = () => {
  const {
    data: offerList,
    error,
    fetchNextPage,
    status
  } = useInfiniteQuery<PagePagination<Offer>, Error | null>(
    ['offers'],
    async ({ pageParam = 1 }) => await getOffers(pageParam),
    {
      getNextPageParam: (lastPage) => checkIfHasNextPage(lastPage)
    }
  );
  return { offerList, error, fetchNextPage, status };
};
