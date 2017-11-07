var _ = require('lodash');

const ROOM_NAME_PREFIX = 'room-'

function getRoom(socket) {
    return _.find(socket.rooms, function(room) {
        return _.startsWith(room, ROOM_NAME_PREFIX);
    });
}

module.exports = (socket) => {
    socket.on('client:user/update', (userdata) => {
        let room = getRoom(socket);
        if (room) socket.to(room).emit('server:user/update', {
            userdata,
            id: socket.id
        });
    });

    socket.on('client:room/update', (room) => {
        let oldRoom = getRoom(socket);

        socket.leave(oldRoom);
        if (oldRoom) socket.to(oldRoom).emit('server:room/user-leave', socket.id);
        if (room) socket.join(ROOM_NAME_PREFIX + room);
    });

    socket.on('client:user/update-request', () => {
        let room = getRoom(socket);
        if (room) socket.to(room).emit('server:user/update-request');
    });

    socket.on('disconnecting', () => {
        let room = getRoom(socket);

        if (!room) return;
        socket.leave(room);
        socket.to(room).emit('server:room/user-leave', socket.id);
    });
}
