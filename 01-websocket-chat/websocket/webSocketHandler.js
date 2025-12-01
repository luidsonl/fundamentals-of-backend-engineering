import RoomManager from "./managers/RoomManager.js";
import UserManager from "./managers/UserManager.js";
import { WebSocketServer } from "ws";
import broadCastTooRoom from "./utils/broacdastToRoom.js";

export default class WebSocketHandler{

    static instance = null;

    /**
     * @param {import('http').Server} server
     */
    constructor(server){
        this.wss = new WebSocketServer({server});
        this.userManager = new UserManager();
        this.roomManager = new RoomManager();
        this.setup();
    }
    
    setup(){
        this.handleConnection();
    }

    handleConnection(){
        this.wss.on('connection', (ws, request) => {
            const url = new URL(request.url, `http://${request.headers.host}`);
            let roomId = url.searchParams.get('room');
            const userName = url.searchParams.get('name');

            const user = this.userManager.createUser(userName, ws);

            if(!roomId){
                roomId = 'main';
            }
            if(process.env.NODE_ENV === 'development'){
                console.log(`New connection: ${user.name} to room ${roomId}`);
            }
            this.roomManager.joinRoom(roomId, user);

            broadCastTooRoom(this.roomManager.getRoomById(roomId), 'System', `${user.name} joined the room.`);
        });
    }

    

    
}