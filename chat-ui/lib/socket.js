import { io } from 'socket.io-client';

let socket = null;

export const connectToSocket = (username) => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      autoConnect: false,
      query: { username }
    });
    
    // Add reconnection handling
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }
  
  return socket;
};