import { useWebSocket } from "../../hooks/useWebSocket";
import Register from "../Register";
import Chat from "../Chat";
import './style.css'
import UserInfo from "../UserInfo";
import UsersList from "../UsersList";

export default function Main() {
    const { isConnected } = useWebSocket();

    if (!isConnected) {
        return <Register />;
    }
    return (
        <section>
            <UserInfo/>
            <section>
                <Chat />
                <UsersList />
            </section>
            
        </section>
    );
}