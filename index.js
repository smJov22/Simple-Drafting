const { Socket } = require("dgram");

const express = require("express");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

const cardGetter = require("./cardGetter.js");

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

let packSize = 4;
let cards = genCardHtml(packSize);
let users = [];
let userNum = 0;

//TEST

cardGetter.getCardImagePaths();

io.on('connection', (socket) => {
    console.log("new connection: ", socket.id);
    if(cards.length == 0) {
        cards = genCardHtml(packSize); 
    }
    socket.emit('gen cards', cards);
    socket.emit('chat message', socket.id);

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        console.log("user disconnected");
    });
    //handling new drafter registration
    socket.on('register drafter', () => {
        users.push(socket.id);
        if(users.length == 1) {
            console.log('first drafter: ', socket.id);
            socket.emit('next pick');
        }
        else(console.log('drafter num: ',users.length))
    });
    //chat message handling
    socket.on('chat message', (msg) => {
        socket.broadcast.emit("chat message", msg);
    });
    //card draft handling
    socket.on('card drafted', (id) => {
        delete cards[id];
        socket.broadcast.emit("card drafted", id);
        let drafter = nextDrafter();
        console.log("next drafter:", drafter)
        io.to(drafter).emit('next pick');
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

function nextDrafter () {
    //probably doesn't work if drafters leave mid way through (users array only adds, doesn't remove upon clients leaving)
    console.log('userNum, totalUsers: ',userNum,', ', users.length)
    userNum++;
    return users[(userNum)%users.length];
}
/*----FEATURE REQUESTS----*/

//retrieve 45 cards from the cube
//make non-repeating random packs of 15 from the cards