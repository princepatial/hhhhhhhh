import axios from 'axios';
import { AreaResponse } from 'globalTypes';

export const getAreas = async () => {
  try {
    const response: {
      data: AreaResponse[];
    } = await axios.get(`/areas`);
    const areasList = response.data;
    return areasList;
  } catch (error) {
    console.log('Error while getting top coaches data');
    return [];
  }
};
