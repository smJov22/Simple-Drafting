const { Socket } = require("dgram");

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

let packSize = 4;
let cards = genCardHtml(packSize);

io.on('connection', (socket) => {
    console.log("new connection: ", socket.id);
    if(cards.length == 0) {
        cards = genCardHtml(packSize); 
    }
    socket.emit('gen cards', cards);

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        console.log("user disconnected");
    });
    //chat message handling
    socket.on('chat message', (msg) => {
        socket.broadcast.emit("chat message", msg);
    });
    //card draft handling
    socket.on('card drafted', (id) => {
        delete cards[id];
        socket.broadcast.emit("card drafted", id);
    });
    
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("listening on port 3000")
});

function genCardHtml (num) {
    console.log("genning cards");
    const colourArray = ['green','blue','yellow','red'];
    let cardHtml = {};
    for(let i=0; i<num; i++) {
        cardHtml[i]=`<div class="card card-${colourArray[i%4]}" id="${i}"></div>`;
    }
    return cardHtml;
}