import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getFilteredNeedsOrOffer, getMyNeedsAndOffers } from './needsAndOffersQuery';
import { AgeValue, MyNeedsAndOffers, Need, Offer, PagePagination } from 'globalTypes';
import { checkIfHasNextPage } from 'queries/helper';

export const useMyNeedsAndOffers = () =>
  useQuery<MyNeedsAndOffers | null, Error | null>(
    ['my-needs-and-offers'],
    async () => await getMyNeedsAndOffers(),
    {
      initialData: null
    }
  );

export const useFilteredNeedsOrOffer = (
  isNeed: boolean,
  limit: number,
  sort?: string | number,
  category?: string | number,
  language?: string | number,
  gender?: string | number,
  age?: AgeValue,
  id?: string
) =>
  useInfiniteQuery<PagePagination<Need | Offer>, Error | null>(
    ['filterCoachOffers', isNeed, limit, sort, category, language, gender, age, id],
    async ({ pageParam = 1 }) =>
      await getFilteredNeedsOrOffer(
        isNeed,
        limit,
        sort,
        category,
        language,
        gender,
        age,
        pageParam,
        id
      ),
    {
      getNextPageParam: (lastPage) => checkIfHasNextPage(lastPage)
    }
  );
