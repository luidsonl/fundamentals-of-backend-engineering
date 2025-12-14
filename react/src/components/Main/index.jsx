import { useWebSocket } from "../../hooks/useWebSocket";
import Register from "../Register";
import Chat from "../Chat";
import './style.css'
import UserInfo from "../UserInfo";
import UsersList from "../UsersList";

export default function Main() {
    const { isConnected } = useWebSocket();


    return(
        <section className="main-container page-width">
            {!isConnected && <Register />}
            {isConnected &&(
                <><UserInfo/>
                <section className="chat-users-container">
                    <Chat />
                    <UsersList />
                </section>
                </>
            )}
        </section>
    )
}