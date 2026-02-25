const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());

const PORT = 1100;

const server = http.createServer(app);

/* 1. First I create socket server (in backend and frontend both) */
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

/* 2. Second I create a is connection */
io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    /* 3. Now create a room ("join_room" : same as frontend with socket.emit and recive a room from frontend (as data) ) */
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room ${data}`);
    });

    /* 4. Now create a message ("send_message" : same as frontend with socket.emit and recive a messageData from frontend (as data) ) */
    socket.on("send_message", data => {
        // console.log(data);
        socket.to(data.room).emit("recive_message", data);
    });

    socket.on("disconnected", () => {
        console.log("User desconnected", socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('App running');
});

// server.listen(PORT, () => {
//     console.log(`Server listenning on ${PORT}`);
// });

const start = async => {
    server.listen(PORT, () => {
        console.log(`Server listenning on ${PORT}`);
    });
}

start();
