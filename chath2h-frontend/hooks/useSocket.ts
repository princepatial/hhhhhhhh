import { useEffect } from 'react';
import { socket } from 'socket';

export const useSocket = (socketName: string, onSocket: (socketResponse?: any) => void) => {
  useEffect(() => {
    socket.on(socketName, (response) => onSocket(response));

    return () => {
      socket.off(socketName);
    };
  }, [onSocket, socketName]);
};
