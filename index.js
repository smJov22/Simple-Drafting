const { Socket } = require("dgram");

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static('public'));
//app.use(express.static('app'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
    //chat message handling
    socket.on('chat message', (msg) => {
        socket.broadcast.emit("chat message", msg);
    });
    //card draft handling
    socket.on('card drafted', (id) => {
        socket.broadcast.emit("card drafted", id);
    });
    
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("listening on port 3000")
});