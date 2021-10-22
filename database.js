const csvParser = require('csv-parser');
const fs = require('fs');
const pubsub = require('pubsub-js');
const common = require('./common');

let token = pubsub.subscribe(common.FILE_READY_TOPIC, (msg,data)=>{
    
    /** @type {common.Source} */
    let source = data;

    console.log(`topic ${msg} called`);

    if(source.getFiletype()==="CSV")
        readAsCsv(source);
});

/**
 * 
 * @param {common.Source} source 
 */
function readAsCsv(source){
    let reader = csvParser(source.getOptions());
    
}