#!/usr/bin/env node

const pubsub = require('pubsub-js');
const common = require('./common');
const downloader = require('./downloader');
const database = require('./database');
const httpServer = require('./httpServer');
const chron = require('./chron');

common.init();
chron.init();
httpServer.initHttpServer();


for(let src of common.allDataSource){
    pubsub.publish(common.CHECK_ETA_TOPIC, src);
}
