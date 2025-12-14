import { useWebSocket } from "../../hooks/useWebSocket";
import './style.css';

export default function UserInfo() {
    const { isConnected, userName, room, disconnect } = useWebSocket();

    const handleDisconnect = () => {
        disconnect();
    }

    return (
        <header className="user-info">
            <div className="row row-top">
                <div className="col">
                    <div className={`status ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
                        Status: {isConnected ? (
                            <span className="success">CONECTADO</span>
                            ) : (
                            <span className="danger">DESCONECTADO</span>
                            )}
                    </div>
                    <div className="user-name">
                        Usuário: {userName}
                    </div>
                </div>
                <div className="col">
                    <div className="button-container">
                        <button className="btn-logout" onClick={handleDisconnect}>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="row row-bottom">
                <div className="room">
                    <h1>Sala: {room}</h1>
                </div>
            </div>
            
        </header>
    );
}