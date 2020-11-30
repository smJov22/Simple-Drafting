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

let cardPool = cardGetter.getCardImagePaths();
let cardsInPacks = 0;

let packs = [];

let users = {};
let userNum = 0;
//todo - max drafter implementation
const maxDrafters = 2;
const packSize = 15;

io.on('connection', (socket) => {
    console.log("new connection: ", socket.id);
    if(Object.keys(users).length < maxDrafters) {
        let {newPack, newPool} = cardGetter.pickPack(cardPool,packSize,cardsInPacks);
        cardPool = newPool;
        cardsInPacks += packSize;
        console.log("new cardpool size = ", cardPool.length);
        packs.push(newPack);
        socket.emit('gen cards', packs[Object.keys(users).length]);
        socket.emit('chat message', socket.id);
    }

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        console.log("user disconnected");
    });
    //handling new drafter registration
    socket.on('register drafter', () => {
        users[socket.id]=[userNum,false];
        userNum++;
        console.log('drafter ready: ', socket.id);
        socket.emit('next pick');
    });
    //chat message handling
    socket.on('chat message', (msg) => {
        socket.broadcast.emit("chat message", msg);
    });
    //card draft handling
    socket.on('card drafted', (id) => {
        console.log("card recieved",id);
        delete packs[users[socket.id][0]%packs.length][id];
        users[socket.id][1] = true;
        if(allUsersReady()) {
            console.log("next draft round")
            for(key in users) {
                users[key][1]=false;
                io.to(key).emit('next pick', packs[(users[key][0]++)%packs.length]);
            }
        }
        //socket.broadcast.emit("card drafted", id);
        else{
            console.log(socket.id, " made a pick!");
        }
    });
    
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log("listening on port 3000")
});

function allUsersReady () {
    for(key in users) {
        if(users[key][1]==false) {
            return false;
        }
    }
    return true;
}
/*----FUTURE FEATURES----*/

//each player gets a pack (like real drafting)
//variable player cap (refuse entry to additional clients)
//stop and reset if someone leaves

//landing page
//get it hosted on AWS