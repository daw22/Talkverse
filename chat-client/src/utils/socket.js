import { io } from 'socket.io-client';


export const socket = io('https://talkverse-api.onrender.com', {
  autoConnect: false
});
