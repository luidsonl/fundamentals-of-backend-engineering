// src/components/Chat.jsx

import  { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket'; // Importa nosso Hook

export default function Chat() {
  const { isConnected, messages, sendMessage } = useWebSocket();
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };
  
  const formatMessage = (msg) => {
    if (msg.startsWith('[Server]')) {
      return { text: msg.replace('[Server]', 'Servidor:'), isServer: true };
    }
    if (msg.startsWith('[Broadcast]')) {
        return { text: msg.replace('[Broadcast]', 'Novo usuário:'), isServer: false };
    }

    return { text: `Você: ${msg}`, isServer: false };
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <header style={{ marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h2 style={{ margin: 0 }}>Sala de Chat Simples</h2>
        <p style={{ 
          color: isConnected ? 'green' : 'red', 
          fontWeight: 'bold', 
          fontSize: 14 
        }}>
          Status: {isConnected ? 'CONECTADO' : 'DESCONECTADO'}
        </p>
      </header>

      <div style={{ height: 300, overflowY: 'auto', marginBottom: 20, border: '1px solid #ddd', padding: 10, backgroundColor: '#f9f9f9' }}>
        {messages.map((rawMsg, index) => {
          const formatted = formatMessage(rawMsg);
          return (
            <div 
              key={index} 
              style={{ 
                marginBottom: 8, 
                padding: 8, 
                borderRadius: 4, 
                backgroundColor: formatted.isServer ? '#ffe0b2' : '#e3f2fd', 
                borderLeft: formatted.isServer ? '4px solid orange' : '4px solid blue'
              }}
            >
              {formatted.text}
            </div>
          );
        })}
        {messages.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Conectando...</p>}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Digite sua mensagem..." : "Aguarde a conexão..."}
          disabled={!isConnected}
          style={{ flexGrow: 1, padding: 10, marginRight: 10, fontSize: 16, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <button
          type="submit"
          disabled={!isConnected || !input.trim()}
          style={{ padding: '10px 20px', fontSize: 16, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}