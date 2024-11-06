import axios from 'axios';

export interface Settings {
  backendURL: string;
  INACTIVITY_TIMEOUT: number;
}

export const getSettings = async () => {
  try {
    const response: {
      data: Settings;
    } = await axios.get('/settings');

    const settings = response.data;
    return settings || {};
  } catch (error) {
    console.log('Error with fetching settings', error);
    return null;
  }
};
