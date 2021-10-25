const database = require('../database');
const common = require('../common');
const downloader = require('../downloader');
const pubsub = require('pubsub-js');

//downloader.initDataRaw(common.COMUNI_ITALIANI);
//database.readAsCsv(common.COMUNI_ITALIANI);
common.initAllDataSources();

pubsub.subscribe(common.DATABASE_READY_TOPIC, (msg,data)=>{

    /** @type {common.Source} */
    let source = data;

    try {
        let piemonte = database.getNomeRegione('TO');
        let noExist = database.getNomeRegione('ZZ');
    } catch (error) {
        console.error(error);
    }

});