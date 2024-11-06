import { useQuery } from '@tanstack/react-query';
import { getChatDetails, getChatRequest } from './chatRequest';

export const useChatRequest = () =>
  useQuery(['chat-request'], async () => await getChatRequest(), {
    initialData: []
  });

export const useChatDetails = (id?: string | string[]) =>
  useQuery(['chat-details', id], async () => await getChatDetails(id), {
    enabled: !!id
  });
