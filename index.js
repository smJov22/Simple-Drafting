const { Socket } = require("dgram");

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('chat message', (msg) => {
        socket.broadcast.emit("chat message", msg);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("listening on port 3000")
});