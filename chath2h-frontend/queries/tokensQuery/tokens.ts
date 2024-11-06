import axios from 'axios';

const url = '/token-transaction';

export const getFilteredTokens = async (skip: number, limit: number, type?: string) => {
  try {
    const response = await axios.get(`${url}/${skip}/${limit}${type ? '/' + type : ''}`);
    const offersList = response.data;
    return offersList;
  } catch (error) {
    console.log(`Error while getting filtered tokens data`);
  }
};

export const getTokensBalance = async () => {
  try {
    const response = await axios.get(`${url}/balance`);
    return response.data;
  } catch (error) {
    console.log(`Error while getting tokens balance`);
  }
};

type OptionsTokensTransactions = {
  isExcel?: boolean;
  fromDate?: string;
  toDate?: string;
};

export const getTokensTransactions = async (options: OptionsTokensTransactions) => {
  const fromDate = options?.fromDate ? `&fromDate=${options?.fromDate}` : '';
  const toDate = options?.toDate ? `&toDate=${options?.toDate}` : '';
  const newUrl = `${url}/generate?isExcel=${options?.isExcel}` + fromDate + toDate;

  try {
    const response = await axios.get(newUrl, {
      responseType: 'blob'
    });
    const data: Blob = response.data;
    return data;
  } catch (error) {
    console.log(`Error while getting tokens transactions`);
  }
};
