import { Socket } from 'socket.io';

declare module 'socket.io' {
    interface Socket {
        username?: string;
        userID?: string;
        sessionID?: string;
        sessionStore?: any;
    }
}

const authMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const username = (socket.handshake as any).username || socket.handshake.auth?.username || socket.handshake.query?.username;
    if (!username) {
        return next(new Error('Invalid username'));
    }

    socket.username = username;
    next();
};

export default authMiddleware;
