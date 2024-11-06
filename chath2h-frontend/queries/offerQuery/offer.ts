import axios from 'axios';
import { requestDataOfferNeed } from 'globalTypes';

const url = '/coach-offer';

export const getOffer = async (id: string | string[] | undefined) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting offer data');
    return null;
  }
};

export const getOffers = async (page: number) => {
  const limit = 7;
  try {
    const response = await axios.get(`${url}`, { params: { page: page, limit } });
    return response.data;
  } catch (error) {
    console.log('Error while getting offers data');
    return [];
  }
};

export const updateOffers = async (
  id: string,
  requestData: requestDataOfferNeed,
  isNotFormData?: boolean
) => {
  try {
    const registerResponse = !isNotFormData
      ? await axios.patch(`${url}/update/${id}`, requestData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      : await axios.patch(`${url}/update/${id}`, requestData);
    return registerResponse.data;
  } catch (error) {
    console.log('Error while updating offers data');
    return null;
  }
};
