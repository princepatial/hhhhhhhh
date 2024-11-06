import { useEffect, useMemo, useState } from 'react';
import { useGlobalState } from '../globalState';
import { UserStatus } from 'globalTypes';

const useUserActivityStatus = (userId: string): UserStatus => {
  const [onlineUsers] = useGlobalState('onlineUsers');
  const [status, setStatus] = useState<UserStatus | null>(null);

  useEffect(() => {
    const userStatus = userId
      ? onlineUsers.find((onlineUser) => onlineUser.userId === userId)
      : null;
    setStatus(userStatus ? (userStatus.status as UserStatus) : null);
  }, [onlineUsers, userId]);

  return status || 'Offline';
};

export default useUserActivityStatus;
