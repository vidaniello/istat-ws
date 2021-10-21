const csvParser = require('csv-parser');
const fs = require('fs');
const eventBus = require('js-event-bus')();

let init = false;
if(!init){
    eventBus.on('fileDownloaded', function(){
        console.log(`downloaded`);
    });
    init = true;
}

function a(){
    console.log("Test 1");
}


module.exports.a = a;