import { Socket } from 'socket.io';
import crypto from 'crypto';
import { MemorySession } from '../stores/MemorySessionStore.js';

const sessionStore = new MemorySession();

const setInfo = (socket: Socket, sessionID: string, { userID, username }: any) => {
    socket.sessionID = sessionID;
    socket.userID = userID;
    socket.username = username;
};

const getRandomID = () => crypto.randomBytes(8).toString('hex');

const sessionMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const sessionID = socket.handshake.auth?.sessionID;

    socket.sessionStore = sessionStore;

    if (sessionID) {
        const session = sessionStore.getSession(sessionID);
        if (session) {
            setInfo(socket, sessionID, session);
            return next();
        }
    }

    const username = socket.handshake.auth?.username || socket.handshake.query?.username;
    if (!username) return next(new Error('Invalid username'));

    const randomUser = {
        userID: getRandomID(),
        username: username,
    };

    const newSessionID = getRandomID();
    setInfo(socket, newSessionID, randomUser);
    next();
};

export default sessionMiddleware;
