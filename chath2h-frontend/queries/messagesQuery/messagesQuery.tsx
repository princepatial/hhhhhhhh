import axios from 'axios';
import { NewMessage, Thread } from 'globalTypes';

export const getThreads = async () => {
  try {
    const response: {
      data: Thread[];
    } = await axios.get('/mailbox');
    return response.data;
  } catch (error) {
    console.log('Error while getting threads data');
    return [];
  }
};

export const getUnreadMessages = async () => {
  try {
    const response: {
      data: number;
    } = await axios.get('/mailbox/unread-messages-count');
    return response.data;
  } catch (error) {
    console.log('Error while getting unread messages data');
    return 0;
  }
};

export const deleteMessage = async (id: string) => {
  try {
    const response = await axios.delete(`/mailbox/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error while trying to delete message');
    return null;
  }
};

export const sendMessage = async (values: NewMessage) => {
  try {
    const response = await axios.post(`/mailbox`, values);
    return response.data;
  } catch (error) {
    console.log('Error while trying to send message');
    return null;
  }
};
