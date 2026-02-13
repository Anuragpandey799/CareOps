import { useEffect } from "react";
import { socket } from "../websocket/socket";

const useSocket = (event, callback) => {
  useEffect(() => {
    socket.connect();

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};

export default useSocket;
