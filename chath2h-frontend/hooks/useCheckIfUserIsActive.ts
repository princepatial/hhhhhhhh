import { useSettings } from 'queries/settingsQuery';
import { useEffect, useRef } from 'react';
import { socket } from 'socket';

const useCheckIfUserIsActive = () => {
  const { data } = useSettings();
  const INACTIVITY_TIMEOUT = data?.INACTIVITY_TIMEOUT || 60 * 10 * 1000; //default to 10 minutes if undefiend
  const isOnline = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleActivity = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isOnline.current) {
      socket.emit('setStatus', 'Online');
      isOnline.current = true;
    } else {
      timeoutRef.current = setTimeout(() => {
        socket.emit('setStatus', 'Offline');
        isOnline.current = false;
      }, INACTIVITY_TIMEOUT);
    }
  };

  const eventsToListen = ['scroll', 'keypress', 'mousedown', 'mousemove'];

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      socket.emit('setStatus', 'Offline');
      isOnline.current = false;
    }, INACTIVITY_TIMEOUT);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    eventsToListen.forEach((event) => window.addEventListener(event, handleActivity));

    return () => {
      eventsToListen.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [isOnline, timeoutRef]);
};

export default useCheckIfUserIsActive;
