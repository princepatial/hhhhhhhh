import axios from 'axios';

export interface H2HToken {
  address: string;
  adminWalletAddress: string;
  startingAmount: string;
}

export const getH2HToken = async () => {
  try {
    const response: {
      data: H2HToken;
    } = await axios.get('/h2hToken');

    const h2hToken = response.data;
    return h2hToken;
  } catch (error) {
    console.log('Error with fetching h2hToken', error);
    return null;
  }
};
