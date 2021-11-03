#!/usr/bin/env node

const pubsub = require('pubsub-js');
const common = require('./common');
const httpServer = require('./httpServer');
const chron = require('./chron');


function init(){

    common.init();

    for(let src of common.allDataSource){
        pubsub.publish(common.CHECK_ETA_TOPIC, src);
    }
    chron.init();
    httpServer.initHttpServer();
}
module.exports.init = init;

init();