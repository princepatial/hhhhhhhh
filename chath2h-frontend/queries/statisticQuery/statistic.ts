import axios from 'axios';

export const getStatistic = async () => {
  try {
    const response = await axios.get('/platform-statistic');
    return response.data;
  } catch (error) {
    console.log('Error while getting statistic data');
    return [];
  }
};
