import axios from 'axios';
import { AgeValue, MyNeedsAndOffers, needOfferLink } from 'globalTypes';

export const getMyNeedsAndOffers = async () => {
  try {
    const response: {
      data: MyNeedsAndOffers;
      error: Error | null;
    } = await axios.get('/users/my-needs-and-offers');

    return response.data;
  } catch (error) {
    console.log('Error while getting my needs and offers data');
    return null;
  }
};

export const getFilteredNeedsOrOffer = async (
  isNeed: boolean,
  limit: number,
  sort?: string | number,
  category?: string | number,
  language?: string | number,
  gender?: string | number,
  age?: AgeValue,
  page?: number,
  id?: string
) => {
  try {
    const newFilters = {
      ['area.name']: category,
      ['user.language']: language,
      ['user.gender']: gender,
      ['user.age']: age,
      ['_id']: id
    };
    const response = await axios.get(
      `/${
        isNeed ? needOfferLink.NEEDS : needOfferLink.OFFERS
      }?limit=${limit}&page=${page}&sortBy=${JSON.stringify(
        { createdAt: sort } || {}
      )}&filterBy=${JSON.stringify(newFilters)}`
    );

    const offersList = response.data;
    return offersList;
  } catch (error) {
    console.log(`Error while getting ${isNeed ? needOfferLink.NEEDS : needOfferLink.OFFERS} data`);
  }
};

export const removeNeedOrOffer = async (offerId: string, isNeed: boolean) => {
  const temporaryUrl = isNeed ? 'needs' : '/coach-offer';
  try {
    const response = await axios.delete(`${temporaryUrl}/${offerId}`);
    return response.data;
  } catch (error) {
    console.log('Error while deleting offer data');
    return null;
  }
};
