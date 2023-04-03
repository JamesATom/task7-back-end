import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { addUser, removeUser, getUser, getUsersInRoom } from "./src/users.js";

const PORT = process.env.PORT || 8000;
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) => {
    socket.on('join', ({ name, room }) => {
        const { error, user, size } = addUser(
            { id: socket.id, name, room });
        
        if (error) console.log(error);

        socket.emit('message', { user: user.name, size });
 
        socket.broadcast.to(user.room).emit('message', { user: user.name, size });
 
        socket.join(user.room);
 
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    });
 
    socket.on('sendMessage', (message) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });
 
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    });
 
    socket.on('remove_user', () => {
        console.log('inside remove socket: ', socket.id);
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('removed', { user: 'admin', text: `${user.name} had left` });
        }
    });

    socket.on('game-move', (data) => {
        socket.emit('game-move', { event: data })
    });

});

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});




// io.on("connection", (socket) => {
//     socket.on("join_game", (data) => {
//         const { username, room } = data;
//         socket.join(room);
//         console.log(username);
//         socket.to(data.room).emit('send_message', 
//         {
//             size: io.sockets.adapter.rooms.get(data.room).size,
//             name: username
//         });
//         // console.log(io.sockets.adapter.rooms.get(room).size, 'here');
//     });
    
// });