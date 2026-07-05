import { Socket } from 'socket.io';

export const generic = (socket: Socket, eventName: string, callback: (...args: any[]) => void) => {
    socket.on(eventName, callback);
};

export const onTestEvent = (socket: Socket, callback?: (...args: any[]) => void) => {
    if (callback) {
        socket.on('testEvent', callback);
    } else {
        socket.on('testEvent', ({ content, to }: { content: any; to: string }) => {
            console.log(content);
            console.log(to);
        });
    }
};
