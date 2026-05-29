import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  const token = localStorage.getItem('bridgecn_token');
  if (!socket) {
    socket = io((import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', ''), {
      autoConnect: false,
      auth: { token }
    });
  }
  if (token) {
    socket.auth = { token };
  }
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
