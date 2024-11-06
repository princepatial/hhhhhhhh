import { Query, UnreadMessagesRequest, User, H2HToken } from 'globalTypes';
import { languageOptions } from 'helpers';
import { i18n } from 'next-i18next';
import { useAuthMe } from 'queries/authorizationQuery';
import { useUnreadMessages } from 'queries/messagesQuery';
import { MutableRefObject, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { socket } from 'socket';
import { useH2HToken } from 'queries/h2hTokenQuery';
import { Router, useRouter } from 'next/router';

type OnlineUser = {
  userId: string;
  status: string;
};

type InitialState = {
  language: {
    value: string;
    label: string;
  };
  user: User | null;
  isUserLogged: boolean;
  isCoachProfile: boolean;
  onlineUsers: OnlineUser[];
  unreadMessagesCount: number;
  chatQuery: Query | null;
  isAdmin: boolean;
  missionRef: MutableRefObject<HTMLElement | null> | null;
  h2hToken: H2HToken | null;
  isWelcomeMessageRead: boolean | null;
};

const initialState: InitialState = {
  language: languageOptions[0],
  user: null,
  isUserLogged: false,
  isCoachProfile: false,
  onlineUsers: [] as OnlineUser[],
  unreadMessagesCount: 0,
  chatQuery: null,
  isAdmin: false,
  missionRef: null,
  h2hToken: null,
  isWelcomeMessageRead: null
};

export const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState(initialState);

export const setGlobalStateUser = (userData: User | null) => {
  setGlobalState('user', userData);

  if (userData) {
    setGlobalState('isUserLogged', true);
    setGlobalState('isCoachProfile', !!userData.coachProfile);
    setGlobalState('isAdmin', userData.admin);
    setGlobalState('isWelcomeMessageRead', userData.isWelcomeMessageRead);
  }
  return userData;
};

const GlobalStateProvider = ({ children }: { children: any }) => {
  const { data: authMeData, isFetched: authMeFetched } = useAuthMe();
  const { data: unreadMessages } = useUnreadMessages(authMeData);
  const { data: h2hToken } = useH2HToken();
  let [unreadMessagesCount] = useGlobalState('unreadMessagesCount');
  const router = useRouter();

  useEffect(() => {
    setGlobalState('unreadMessagesCount', unreadMessages);
  }, [unreadMessages]);

  useEffect(() => {
    setGlobalState('h2hToken', h2hToken);
  }, [h2hToken]);

  useEffect(() => {
    const user = setGlobalStateUser(authMeData);

    if (router.asPath.includes('admin') && authMeFetched) {
      if (!user?.admin) router.replace('/');
    }
  }, [authMeData, authMeFetched]);

  useEffect(() => {
    setGlobalState(
      'language',
      languageOptions.find((lang) => lang.value === i18n?.language) || languageOptions[0]
    );
  }, []);

  useEffect(() => {

    socket.on('onlineUsers', (users: { userId: string; status: string }[]) => {
      setGlobalState('onlineUsers', users);
    });

    socket.on('ConversationRequest', () => {
      setGlobalState('unreadMessagesCount', ++unreadMessagesCount);
    });

    socket.on('MailboxUnreadMessagesRequest', (unreadMessagesRequest: UnreadMessagesRequest) => {
      setGlobalState('unreadMessagesCount', unreadMessagesRequest.count);
    });

    socket.emit('getOnlineUsers');

    return () => {
      socket.off('onlineUsers');
      socket.off('ConversationRequest');
      socket.off('MailboxUnreadMessagesRequest');
    };
  }, []);

  return children;
};

export default GlobalStateProvider;
