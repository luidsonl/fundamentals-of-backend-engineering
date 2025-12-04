import { createContext, useContext, useEffect, useRef, useState } from "react";
import { WS_URL } from "../../../config/constants";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const wsRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => setIsConnected(true);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "setting" && data.userName) {
        setUserName(data.userName);
        return;
      }

      setMessages(prev => [data, ...prev]);
    };

    socket.onclose = () => setIsConnected(false);

    socket.onerror = (err) => {
      console.error("WS error:", err);
    };

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn("Socket not open");
    }
  };

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      messages,
      userName,
      sendMessage
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
