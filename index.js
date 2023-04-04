import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { addUser, removeUser, getUser, getUsersInRoom } from "./src/users.js";

const PORT = process.env.PORT || 8000;
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on("connection", (socket) => {
    socket.on('join', ({ name, room }) => {
        const { error, user, size } = addUser({ id: socket.id, name, room });
        
        if (error) console.log(error);

        socket.emit('message', { user: user.name, size });

        socket.broadcast.to(room).emit('message', { user: user.name, size });
        
        socket.join(room);
        
        // io.emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        socket.on('game-move', (data) => {
            socket.to(room).emit('game-move', { event: data });
        });
    });
 
    socket.on('sendMessage', (message) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
 
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    });
 
    socket.on('remove_user', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('removed', { user: 'admin', text: `${user.name} had left` });
        }
    });

});




server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

// console.log(io.sockets.adapter.rooms.get(room));