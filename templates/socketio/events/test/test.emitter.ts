import { Socket } from 'socket.io';

export const emitEmpty = (socket: Socket) => {
    socket.emit('emitEmpty', []);
};

export const broadcastEmpty = (socket: Socket) => {
    socket.broadcast.emit('broadcastEmpty', {});
};

export const privateEmpty = (socket: Socket, recipient: string) => {
    socket.to(recipient).emit('privateEmpty', {
        from: socket.id,
    });
};
