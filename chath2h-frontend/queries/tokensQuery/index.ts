import { useInfiniteQuery } from '@tanstack/react-query';
import { getFilteredTokens } from './tokens';
import { PagePagination, TokensTransaction } from 'globalTypes';

export const useFilteredTokens = (limit: number, type?: string) => {
  return useInfiniteQuery<PagePagination<TokensTransaction>, Error | null>(
    ['filterTokens', limit, type],
    async ({ pageParam = 0 }) => await getFilteredTokens(pageParam, limit, type),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage) {
          return undefined;  // or another fallback value
        }
        
        return lastPage.hasNextPage
          ? Math.floor((lastPage.skip ?? 0) / limit + limit) + 1
          : undefined;
      }
      
    }
  );
};