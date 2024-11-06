import axios from 'axios';
import { CoachesWithCategories, User } from 'globalTypes';

const url = '/coaches/';

export const getCoach = async (id: string | string[] | undefined) => {
  try {
    const response = await axios.get(url + id);
    return response.data;
  } catch (error) {
    console.log('Error while getting coach data');
    return null;
  }
};

export const getAllCoaches = async () => {
  try {
    const response: {
      data: User[];
    } = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('Error while getting all coaches data');
    return [];
  }
};

export const getRandomCoaches = async (ids: string[]) => {
  try {
    const response: {
      data: CoachesWithCategories[];
    } = await axios.post(`${url}random-coaches`, {
      ids
    });
    return response.data;
  } catch (error) {
    console.log('Error while getting random coaches data');
    return [];
  }
};

export const getTopCoaches = async () => {
  try {
    const response = await axios.get(`${url}top-coaches`);
    return response.data;
  } catch (error) {
    console.log('Error while getting top coaches data');
    return [];
  }
};

export const getFavoriteCoaches = async () => {
  try {
    const response: {
      data: CoachesWithCategories[];
    } = await axios.get(`${url}favorite-coaches`);
    return response.data;
  } catch (error) {
    console.log('Error while getting favorite coaches data');
    return [];
  }
};

export const updateFavoriteCoach = async (id: string) => {
  try {
    const response: {
      data: User;
    } = await axios.patch(`${url}update-favorite-coach/${id}`);

    return response.data;
  } catch (error) {
    console.log('Error with update favorite coach', error);
    return null;
  }
};
