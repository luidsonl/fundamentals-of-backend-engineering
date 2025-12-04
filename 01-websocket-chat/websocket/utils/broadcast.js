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
 * @param {user} User 
 * @param {String} message 
 */
export function broadcastSystemToUser( user, message ){

    const data = {
        sender: 'System',
        message,
        timestamp: new Date().toISOString()
    };

    user.client.send(JSON.stringify({
        ...data
    }));
}


/**
 * 
 * @param {user} User 
 */
export function broadcastUserConnected( user ){
    const data = {
        sender: 'System',
        type: 'setting',
        userName: user.name,
        timestamp: new Date().toISOString()
    };

    user.client.send(JSON.stringify({
        ...data
    }));
}
