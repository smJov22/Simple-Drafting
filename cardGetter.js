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
    let newPack = {};
    for(let i=0; i<packSize; i++) {
        let rand = Math.floor(Math.random() * packSize);
        let card = cardPool[rand];
        console.log(card);
        newPack[i]=`<div class="card" id="${i}" style='background-image:url("${card}")'></div>`;
        cardPool.splice(rand,1);      
    }
    let newPool = cardPool;
    return {newPack, newPool};
}

//pool : an array of card paths
//pack : a dictionary of id:cardHTML(string) pairs
function removePackFromPool (pack, pool) {

}

module.exports.getCardImagePaths = getCardImagePaths;
module.exports.pickPack = pickPack;