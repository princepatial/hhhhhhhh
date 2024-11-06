import axios from 'axios';
import { requestDataOfferNeed } from 'globalTypes';

const url = '/needs';

export const getNeedDetails = async (id: string | string[] | undefined) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting need data');
    return null;
  }
};

export const getNeeds = async (page: number) => {
  const limit = 7;
  try {
    const response = await axios.get(url, { params: { page: page, limit } });
    return response.data;
  } catch (error) {
    console.log('Error while getting needs data');
    return [];
  }
};

export const updateNeed = async (
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
