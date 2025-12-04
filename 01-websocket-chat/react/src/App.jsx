import Chat from "./components/Chat";
import { WebSocketProvider } from "./contexts/WebSocketProvider";

export default function App() {
  return (
    <WebSocketProvider>
      <Chat/> 
    </WebSocketProvider>
   
  );
}
