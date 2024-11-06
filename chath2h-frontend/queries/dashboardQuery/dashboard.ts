import axios from 'axios';
export const getDashboard = async () => {
  try {
    const response = await axios.get(`/dashboard`);
    return response.data;
  } catch (error) {
    console.log('Error while getting last viewed data');
    return null;
  }
};
