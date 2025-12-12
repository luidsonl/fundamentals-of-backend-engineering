import  { useState } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import './style.css';

export default function Chat() {
  const { isConnected, messages, sendMessage, userName} = useWebSocket();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className='chat-container'>
      <div className='messages-container'>
        {messages.map((message, index) => {
          return (
            <div 
              key={index}
              className={`message-item ${message.sender === userName ? 'own-message' : ''} ${message.sender === 'System' ? 'system-message' : ''}`}
            >
              <span className='sender-name'>
                {message.sender}
              </span>
              <span className='sender-message'>
                {message.message}
              </span>
            </div>
          );
        })}
        {messages.length === 0 && <p>Conectando...</p>}
      </div>

      <form onSubmit={handleSubmit} className='input-container'>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Digite sua mensagem..." : "Aguarde a conexão..."}
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!isConnected || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}