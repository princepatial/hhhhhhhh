import { useQuery } from '@tanstack/react-query';
import { getThreads, getUnreadMessages } from './messagesQuery';

export const useThreads = () =>
  useQuery(['threads'], async () => await getThreads(), {
    initialData: []
  });

export const useUnreadMessages = (user: any) =>
  useQuery(['UnreadMessages'], async () => await getUnreadMessages(), {
    initialData: 0,
    enabled: !!user
  });
