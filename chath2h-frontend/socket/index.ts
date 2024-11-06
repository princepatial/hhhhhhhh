import getConfig from 'next/config';
import { io } from 'socket.io-client';
const { publicRuntimeConfig } = getConfig();

const makeWsUrl = () => {
  // if (typeof window !== 'undefined') {
  //   if (window.location.href.includes('http://localhost')) {
  //     return publicRuntimeConfig.WS_BACKEND_URL;
  //   } else {
  //     const wsUrl = 'wss://' + window.location.href.split('/')[2];
  //     return wsUrl;
  //   }
  // }
  return "http://localhost:3001";
};

export const socket = io(makeWsUrl(), { path: '/api/socket.io', withCredentials: true });

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});
