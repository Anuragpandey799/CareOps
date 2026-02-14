import { io } from "socket.io-client";

const socketURL = import.meta.env.PROD
  ? import.meta.env.VITE_SOCKET_URL_PROD
  : import.meta.env.VITE_SOCKET_URL;

const socket = io(socketURL, {
  withCredentials: true,
});

export default socket;
