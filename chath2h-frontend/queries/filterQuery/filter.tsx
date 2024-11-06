import axios from 'axios';
import { FilterDataType, FiltersCoach, FiltersNeedOffer } from 'globalTypes';
import { flatten } from 'flat';
import { serializeObject } from 'queries/helper';

enum FiltersUrl {
  COACH = 'coaches',
  NEED = 'needs',
  COACH_OFFER = 'coach-offer'
}

export const getFilteredData = async (
  type: FilterDataType,
  limit: number,
  page?: number,
  sort?: string | number,
  filters?: FiltersCoach | FiltersNeedOffer
) => {
  const url = FiltersUrl[type];
  try {
    const newFilters: FiltersCoach | FiltersNeedOffer = filters ? flatten(filters) : {};
    const response = await axios.get(
      `/${url}?limit=${limit}&page=${page}&sortBy=${JSON.stringify(
        { createdAt: sort } || {}
      )}&filterBy=${serializeObject(newFilters)}`
    );

    const offersList = response.data;
    return offersList;
  } catch (error) {
    console.log(`Error while getting ${url} data`);
  }
};
