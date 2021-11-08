#!/usr/bin/env node

const pubsub = require('pubsub-js');
const common = require('./common');
const downloader = require('./downloader');
const database = require('./database');
const httpServer = require('./httpServer');
const chron = require('./chron');

let token = pubsub.subscribe(common.CHECK_ALL_DATASOURCE_TOPIC, (msg,data)=>{
    console.log(`topic '${msg}'' called`);
    checkAllDatasource();
});

common.init();
chron.init();
httpServer.initHttpServer();

function checkAllDatasource(){
    for(let src of common.allDataSource){
        pubsub.publish(common.CHECK_ETA_TOPIC, src);
    }
}

checkAllDatasource();