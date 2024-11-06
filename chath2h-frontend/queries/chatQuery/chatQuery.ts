import axios from 'axios';
import { JoinChat } from 'globalTypes';

const url = '/chat';

export const joinChat = async (item: JoinChat) => {
  try {
    const response = await axios.post(`${url}/join`, item);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const rateCoach = async (interactionId: string, rate: number) => {
  try {
    await axios.post(`${url}/rate-interaction`, { interactionId, rate });
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const finishChat = async (interactionId: string, initiator: string) => {
  try {
    const response = await axios.post(`${url}/finish-interaction`, { interactionId, initiator });
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const saveChatDuration = async (interactionId: string, chatDuration: number) => {
  try {
    const response = await axios.patch(`${url}/duration`, { interactionId, chatDuration });
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const preFinishChat = async (interactionId: string, initiator: string) => {
  try {
    const response = await axios.post(`${url}/finish-interaction`, { interactionId, initiator });
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const getChatInteraction = async (interactionId: string) => {
  try {
    const response = await axios.get(`${url}/${interactionId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export const payment = async (paymentData: { userId: string; interactionId: string }) => {
  try {
    const response = await axios.post(`${url}/payment`, paymentData);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
};
