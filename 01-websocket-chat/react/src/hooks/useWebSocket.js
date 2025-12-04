import { useWebSocketContext } from "../contexts/WebSocketProvider";

export const useWebSocket = () => {
  return useWebSocketContext();
};
