import RoomManager from "./managers/RoomManager.js";
import UserManager from "./managers/UserManager.js";
import { WebSocketServer } from "ws";
import { broadcastToRoom, broadCastSystemToRoom, broadcastUserConnected, broadcastRoomUsersList } from "./utils/broadcast.js";
import User from "./entities/User.js";
import { PING_INTERVAL } from "../config/constants.js";

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
            
            this.roomManager.joinRoom(roomId, user);

            this.initConnection(user, roomId);
            this.setHandleMessage(user, roomId);
            this.setHandleClose(user, roomId);
            this.setHandleError(user, roomId);
            this.setHandlePong(user);
            this.setupHeartbeat(user, roomId);

        });

        this.wss.on('error', (error) => {
            if (process.env.NODE_ENV === 'development') {
                console.error('WebSocket Server error:', error);
            }
        });

        this.wss.on('close', () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('WebSocket Server closed');
            }
            
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
        broadcastRoomUsersList(this.roomManager.getRoomById(roomId));

        if (process.env.NODE_ENV === 'development') {
            console.log(`New connection: ${user.name} to room ${roomId}`);
        }
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
     * Handle pong responses from client
     * @param {User} user 
     */
    setHandlePong(user) {
        user.client.on('pong', () => {
            user.isAlive = true;
        });
    }

    /**
     * Setup heartbeat mechanism to detect dead connections
     * @param {User} user 
     * @param {string} roomId 
     */
    setupHeartbeat(user, roomId) {
        user.isAlive = true;

        const pingInterval = setInterval(() => {
            if (user.isAlive === false) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Connection timeout for user: ${user.name}`);
                }
                clearInterval(pingInterval);
                this.cleanupUser(user, roomId);
                return;
            }

            user.isAlive = false;
            if (user.client.readyState === user.client.OPEN) {
                user.client.ping();
            }
        }, PING_INTERVAL);

        user.pingInterval = pingInterval;
    }

    /**
     * Cleanup user resources to prevent memory leaks
     * @param {User} user 
     * @param {string} roomId 
     */
    cleanupUser(user, roomId) {
        this.roomManager.leaveRoom(roomId, user);

        if (user.pingInterval) {
            clearInterval(user.pingInterval);
            user.pingInterval = null;
        }

        if (user.client) {
            user.client.removeAllListeners();
        }

        this.userManager.removeUser(user.id);

        const room = this.roomManager.getRoomById(roomId);
        
        if (room) {
            broadCastSystemToRoom(`${user.name} left the room.`, room, [user]);
            broadcastRoomUsersList(room);
        }
        

        if (process.env.NODE_ENV === 'development') {
            console.log(`Cleaned up user: ${user.name} from room ${roomId}`);
        }
    }
}