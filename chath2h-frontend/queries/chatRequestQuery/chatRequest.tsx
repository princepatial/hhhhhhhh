import axios from 'axios';
import { NewChatInvitationType, StartChatRequest } from 'globalTypes';

const url = '/chat-request';

export const getChatRequest = async () => {
  try {
    const response: {
      data: NewChatInvitationType[];
    } = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log('Error while getting chat request data');
    return [];
  }
};

export const newChatRequest = async (data: StartChatRequest) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.log('Error while trying to make new chat request');
    return null;
  }
};

export const getChatDetails = async (id?: string | string[]) => {
  if (id) {
    try {
      const response = await axios.get(`${url}/${id}`);

      return response.data;
    } catch (error) {
      console.log('Error while getting chat request details');
      return {};
    }
  }
};

export const acceptChatRequest = async (id: string, socket: string) => {
  try {
    const response: {
      data: NewChatInvitationType[];
    } = await axios.post(`${url}/accept/${id}`, { socketId: socket });

    return response.data;
  } catch (error) {
    console.log('Error while trying to accept chat request');
    return [];
  }
};

export const declineChatRequest = async (id: string) => {
  try {
    const response = await axios.post(`${url}/decline/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error while trying to decline chat request');
    return [];
  }
};
