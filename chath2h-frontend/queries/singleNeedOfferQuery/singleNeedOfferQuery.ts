import axios from 'axios';

const url = '/user-interactions';

export const getSingleNeedOffer = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${url}/single-need-offer/${id}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting single need/offer data');
    return null;
  }
};

export const getSingleNeedOfferConversation = async (id: string, userId: string) => {
  try {
    const response = await axios.get(`${url}/chatHistory/${id}/${userId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting single need/offer chatHistory data');
    return null;
  }
};

export const getSingleNeedOfferChats = async () => {
  try {
    const response = await axios.get(`${url}/chats`);
    return response.data;
  } catch (error) {
    console.log('Error while getting single need/offer chats data');
    return null;
  }
};
