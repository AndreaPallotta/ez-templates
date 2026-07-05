import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { serverConfig } from './utils/env.config.js';
import authMid from './middleware/auth.js';
import sessionMid from './middleware/session.js';
import Logger from './logging/logger.js';

import { broadcastEmpty } from './events/test/test.emitter.js';
import { onTestEvent } from './events/test/test.listener.js';

const app = express();
const server = new HttpServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: [serverConfig.ORIGIN],
    },
});

io.use(authMid);
io.use(sessionMid);

io.on('connection', (socket) => {
    const { sessionID, userID, username, sessionStore } = socket;

    sessionStore.connect(sessionID, { userID, username });

    socket.emit('session', {
        sessionID,
        userID,
    });

    socket.on('disconnect', async () => {
        const matchingSockets = await io.in(userID!).allSockets();
        if (matchingSockets.size) {
            Logger.error(`Error disconnecting ${username}`);
            return;
        }
        socket.broadcast.emit(`user ${username} disconnected`);
        sessionStore.disconnect(sessionID!);
        Logger.debug(`disconnected ${socket.id}`);
    });

    onTestEvent(socket);
    broadcastEmpty(socket);
});

app.use('/public', express.static('public'));
app.disable('x-powered-by');
app.options('*', (_, res) => {
    res.sendStatus(200);
});

export { io, server };
