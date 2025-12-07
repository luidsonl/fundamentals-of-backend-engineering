import { v4 as uuid } from 'uuid'
import Room from './Room.js';

export default class User {

    /**
     * @param {string} name 
     * @param {WebSocket} client
     */
    constructor(name, client) {
        this.id = uuid();
        this.client = client;
        this.setName(name);
    }

    /**
     * @param {string} name 
     */
    setName(name) {
        if (name) {
            this.name = name;
            return;
        }

        this.name = this.id.slice(0, 5);
        return;
    }

    /**
     * Cleanup method to properly release resources and prevent memory leaks
     */
    cleanup() {
        if (this.client && this.client.readyState !== this.client.CLOSED) {
            this.client.removeAllListeners();
            this.client.close();
        }
        this.client = null;
    }

}