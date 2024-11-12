import axios from 'axios';
import { NextRouter } from 'next/router';
import { toast } from 'react-toastify';

const url = 'http://localhost:3001/api/auth';

export const getAuthorization = async (router: NextRouter, token?: string | string[]) => {
  try {
    const response = await axios.get(`${url}/{$router.locale}/callback?token=${token}`);
    const authorizationData = response.data;
    if (authorizationData) {
      sessionStorage.setItem('user', JSON.stringify(authorizationData));
    }
    return authorizationData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;

      if (status === 401) {
        toast.error('Token is invalid or expired! Try again');
        router.push('/authorization');
      } else if (status === 409) {
        router.push(`/register?token=${token}`);
      } else if (status === 500) {
        console.log('Error while authorizing');
        router.push('/authorization');
      }
    }
    return null;
  }
};

export const getAuthMe = async () => {
  try {
    const response = await axios.get(`${url}/me`);
    const authorizationData = response.data;
    if (authorizationData instanceof Object) {
      return authorizationData;
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;

      if (status === 403) {
        console.log('User is not logged');
      }
    }
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.get(`${url}/logout`);
    return response;
  } catch (error) {
    console.log('Error when trying to logout');
  }
};
