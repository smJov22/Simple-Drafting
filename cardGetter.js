const path = require('path');
const fs = require('fs');

const dirPath = path.join(__dirname, 'public', 'cards');

function getCardImagePaths () {
    cards = [];
    fs.readdir(dirPath, function(err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            let card = path.join('/cards/',file);
            cards.push(card); 
        });
    });
    return cards;
}

function pickPack (cardPool, packSize) {
    let pack = {};
    for(let i=0; i<packSize; i++) {
        let rand = Math.floor(Math.random() * packSize);
        let card = cardPool[rand];
        console.log(card);
        pack[i]=`<div class="card" id="${i}" style='background-image:url("${card}")'></div>`;
        cardPool.splice(rand,1);
    }
    return pack;
}

module.exports.getCardImagePaths = getCardImagePaths;
module.exports.pickPack = pickPack;