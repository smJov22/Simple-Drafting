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
            // Do whatever you want to do with the file
            let card = path.join('/public/cards',file);
            cards.push(card);
            console.log(card); 
        });
        return cards;
    });
}

module.exports.getCardImagePaths = getCardImagePaths;