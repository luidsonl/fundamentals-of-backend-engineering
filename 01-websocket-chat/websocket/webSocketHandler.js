import RoomManager from "./managers/RoomManager.js";
import UserManager from "./managers/UserManager.js";
import { WebSocketServer } from "ws";
import { broadcastToRoom, broadCastSystemToRoom, broadcastUserConnected } from "./utils/broadcast.js";
import User from "./entities/User.js";

export default class WebSocketHandler {

    static instance = null;

    /**
     * @param {import('http').Server} server
     */
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.userManager = new UserManager();
        this.roomManager = new RoomManager();
        this.setup();
    }

    setup() {
        this.handleConnection();
    }

    handleConnection() {
        this.wss.on('connection', (ws, request) => {
            const url = new URL(request.url, `http://${request.headers.host}`);
            let roomId = url.searchParams.get('room');
            const userName = url.searchParams.get('name');

            const user = this.userManager.createUser(userName, ws);

            if (!roomId) {
                roomId = 'main';
            }
            if (process.env.NODE_ENV === 'development') {
                console.log(`New connection: ${user.name} to room ${roomId}`);
            }
            this.roomManager.joinRoom(roomId, user);

            this.initConnection(user, roomId);
            this.setHandleMessage(user, roomId);
            this.setHandleClose(user, roomId);
            this.setHandleError(user, roomId);

        });

    }

    /**
     * 
     * @param {User} user 
     * @param {string} roomId 
     */
    initConnection(user, roomId) {
        broadCastSystemToRoom(`${user.name} joined the room.`, this.roomManager.getRoomById(roomId));
        broadcastUserConnected(user, roomId);
    }

    /**
     * 
     * @param {string} roomId 
     * @param {User} user 
     */
    setHandleMessage(user, roomId) {
        user.client.on('message', (data) => {
            const message = data.toString();
            broadcastToRoom(message, this.roomManager.getRoomById(roomId), user.name);
        });
    }


    /**
     * 
     * @param {string} roomId 
     * @param {User} user 
     */
    setHandleClose(user, roomId) {
        user.client.on('close', () => {
            this.cleanupUser(user, roomId);
        });
    }

    /**
     * 
     * @param {string} roomId 
     * @param {User} user 
     */
    setHandleError(user, roomId) {
        user.client.on('error', (error) => {
            if (process.env.NODE_ENV === 'development') {
                console.error(`WebSocket error for user ${user.name}:`, error);
            }
            this.cleanupUser(user, roomId);
        });
    }

    /**
     * Cleanup user resources to prevent memory leaks
     * @param {User} user 
     * @param {string} roomId 
     */
    cleanupUser(user, roomId) {
        // Remove from room
        this.roomManager.leaveRoom(roomId, user);

        // Broadcast user left
        const room = this.roomManager.getRoomById(roomId);
        if (room) {
            broadCastSystemToRoom(`${user.name} left the room.`, room, [user]);
        }

        // Remove all event listeners from the WebSocket client
        if (user.client) {
            user.client.removeAllListeners();
        }

        // Remove from UserManager
        this.userManager.removeUser(user.id);

        if (process.env.NODE_ENV === 'development') {
            console.log(`Cleaned up user: ${user.name} from room ${roomId}`);
        }
    }
}