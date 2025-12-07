import User from "../entities/User.js";


export default class UserManager {
    /**
     * 
     * @param {WebSocket} client 
     */
    constructor(client) {
        /**
         * @type {Map<string, User>}
         * 
         */
        this.users = new Map();
        this.client = client;
    }

    /**
     * @param {string} name
     * @param {WebSocket} client
     * @returns {User}
     */
    createUser(name, client) {
        const user = new User(name, client);
        this.users.set(user.id, user);
        return user;
    }

    /**
     * @param {string} userId 
     * @returns {User | null}
     */
    getUser(userId) {
        if (this.users.has(userId)) {
            return this.users.get(userId);
        }

        return null;
    }

    /**
     * @param {string} userId 
     */
    removeUser(userId) {
        const user = this.getUser(userId);
        if (!user) {
            return;
        }

        // Cleanup user resources before removing
        if (user.cleanup) {
            user.cleanup();
        }

        this.users.delete(userId);
    }
}