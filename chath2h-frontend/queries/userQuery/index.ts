import { useQuery } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { PaginateUser } from 'globalTypes';
import { getFilteredUsers, getUsersToFile } from './user';

export const useFilteredUsers = (
  limit: number,
  page: number,
  sort?: SortingState,
  filters?: ColumnFiltersState
) =>
  useQuery<PaginateUser, Error | null>(
    ['filteredUsers', limit, page, sort, filters],
    async () => await getFilteredUsers(limit, page, sort, filters)
  );
