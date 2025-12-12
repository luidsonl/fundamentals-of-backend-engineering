import { json } from "express";
import Room from "../entities/Room.js";
import User from "../entities/User.js";

/**
 * 
 * @param {String} message
 * @param {Room} room 
 * @param {string | User} sender
 * @param {User[]} blackList
 */
export function broadcastToRoom( message ,room, sender, blackList = [] ){
    room.users.forEach( user => {
        
        if( blackList.includes(user) ) return;

        const data = {
            sender,
            type: 'message',
            message,
            roomId: room.id,
            timestamp: new Date().toISOString()
        };

        if (sender instanceof User){
            data.sender = sender.name;
        }

        user.client.send(JSON.stringify({
            ...data
        }));
    });
}
/**
 * @param {String} message 
 * @param {Room} room 
 * @param {User[]} blackList
 */
export function broadCastSystemToRoom( message, room, blackList = [] ){
    room.users.forEach( user => {
        if( blackList.includes(user) ) return;

        const data = {
            sender: 'System',
            type: 'message',
            message,
            roomId: room.id,
            timestamp: new Date().toISOString()
        };

        user.client.send(JSON.stringify({
            ...data
        }));
    });
}


/**
 * 
 * @param {User} user 
 * @param {String} message 
 */
export function broadcastSystemToUser( user, message ){

    const data = {
        sender: 'System',
        type: 'message',
        message,
        timestamp: new Date().toISOString()
    };

    user.client.send(JSON.stringify({
        ...data
    }));
}

/**
 * @param {Room} room
 */
export function broadcastRoomUsersList( room ){
    const usersList = room.users.map( user => user.name );

    const data = {
        sender: 'System',
        type: 'users_list',
        users: usersList,
        roomId: room.id,
        timestamp: new Date().toISOString()
    };

    room.users.forEach( user => {
        user.client.send(JSON.stringify({
            ...data
        }));
    });
}


/**
 * 
 * @param {User} user 
 * @param {string} roomId
 */
export function broadcastUserConnected( user, roomId ){
    const data = {
        sender: 'System',
        type: 'setting',
        userName: user.name,
        roomId: roomId,
        timestamp: new Date().toISOString()
    };

    user.client.send(JSON.stringify({
        ...data
    }));
}
