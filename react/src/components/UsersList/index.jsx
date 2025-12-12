import { useWebSocket } from "../../hooks/useWebSocket";

export default function UsersList() {
    const { usersList } = useWebSocket();

    return (
        <aside>
            <h2>Usuários na sala</h2>
            <ul>
                {usersList.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </aside>
    );
}