import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import axios from 'axios';
import { headers } from 'next/dist/client/components/headers';

const url = '/users';

export const getFilteredUsers = async (
  limit: number,
  page?: number,
  sort?: SortingState,
  filters?: ColumnFiltersState
) => {
  try {
    const response = await axios.get(
      `${url}?limit=${limit}&page=${page}&sortBy=${JSON.stringify(
        sort?.[0] ? { [sort?.[0].id]: sort?.[0].desc ? 1 : -1 } : {}
      )}&filterBy=${JSON.stringify(filters)}`
    );

    return response.data;
  } catch (error) {
    console.log('Error while getting users', error);
    return null;
  }
};

export const getUsersToFile = async (isExcel: boolean = false) => {
  try {
    const response = await axios.get(`${url}/users-list-file${isExcel ? '?isExcel=true' : ''}`, {
      responseType: 'blob'
    });
    const data: Blob = response.data;
    return data;
  } catch (error) {
    console.log('Error while getting users file', error);
    return null;
  }
};
