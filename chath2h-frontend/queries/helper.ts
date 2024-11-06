import {
  CoachPage,
  FiltersCoach,
  FiltersNeedOffer,
  Need,
  Offer,
  PagePagination
} from 'globalTypes';

export const checkIfHasNextPage = (lastPage: PagePagination<Offer | Need | CoachPage>) =>
  lastPage?.hasNextPage ? lastPage.page && lastPage?.page + 1 : undefined;

export function serializeObject(obj: FiltersCoach | FiltersNeedOffer) {
  const serializedObj: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!!value) {
      serializedObj[key] = encodeURIComponent(value);
    }
  }
  return JSON.stringify(serializedObj);
}
