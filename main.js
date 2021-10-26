const dotenv = require('dotenv');
const pubsub = require('pubsub-js');
const common = require('./common');
const httpServer = require('./httpServer');
const chron = require('./chron');


function init(){
    dotenv.config();
    common.init();

    for(let src of allDataSource){
        pubsub.publish(common.CHECK_ETA_TOPIC, src);
    }
    chron.init();
    httpServer.initHttpServer();
}
module.exports.init = init;
