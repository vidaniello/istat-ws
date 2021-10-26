const csvParser = require('csv-parser');
const iconv = require('iconv-lite');
const fs = require('fs');
const pubsub = require('pubsub-js');
const common = require('./common');

let token = pubsub.subscribe(common.NEW_FILE_READY_TOPIC, (msg,data)=>{
    console.log(`topic '${msg}'' called`);
    onNewFileReadyTopic(data);
});

let token = pubsub.subscribe(common.FILE_READY_TOPIC, (msg,data)=>{
    console.log(`topic '${msg}'' called`);
    onFileReadyTopic(data);
});

/**
 * 
 * @param {common.Source} source 
 */
function onNewFileReadyTopic(source){
    if(source.getFiletype()==="CSV")
        readAsCsv(source);
    else
        console.error(`ERROR, for the source with code '${source.getCode()}' of type '${source.getFiletype()}' not exist parser.`);
}

/**
 * 
 * @param {common.Source} source 
 */
 function onFileReadyTopic(source){
    switch(source.getCode()){
        case common.PROC_COMUNI_ITALIANI:
            if(!isDatabasesLoaded_ElencoComuniItaliani())
                onNewFileReadyTopic(source);
            break;
        default:
            console.error(`'${source.getCode()}' datasource code not implemented.`);
    }
}


/**
 * 
 * @param {common.Source} source 
 */
function readAsCsv(source){
    fs.createReadStream(source.getFilenameWithPath())
      .pipe(iconv.decodeStream(source.getEncoding()))
      .pipe(csvParser(source.getOptions()))
      .on('headers', (header)=>onReadStreamEvent('headers', source, header))
      .on('data', (data)=>onReadStreamEvent('data', source, null, data))
      .on('end', ()=>onReadStreamEvent('end', source));
}
module.exports.readAsCsv = readAsCsv;

/**
 * 
 * @param {string} eventType
 * @param {common.Source} source 
 * @param {*} header 
 * @param {*} data 
 */
function onReadStreamEvent(eventType, source, header, data){

    if(eventType==="end"){
        console.log(`'${source.getFilename()}'' parsed as CSV encoded in '${source.getEncoding()}'' format`);
        pubsub.publish(common.DATABASE_READY_TOPIC, source);
    }
    
    if(eventType==="headers"){
        console.log(`'${source.getFilename()}'' start parsing`);
    }

    switch(source.getCode()){
        case common.PROC_COMUNI_ITALIANI:
            onEvent_ElencoComuniItaliani(eventType, source, header, data)
            break;
        default:
            console.error(`'${source.getCode()}' datasource code not implemented.`);
    }
}


// ============== PROCEDURE ELENCO COMUNI ITALIANI ===================================

/** @type {Map<string,string>} */
let mappa_ProvIso2_Regione = new Map();

/**
 * 
 * @param {string} eventType
 * @param {common.Source} source 
 * @param {*} header 
 * @param {*} data 
 */
function onEvent_ElencoComuniItaliani(eventType, source, header, data){
    switch(eventType){

        case 'headers':
            //console.log(header);
            clearElencoComuniItaliani();
            break;

        case 'data':
            //console.log(data);
            
            /** @type {string} */
            let codiceReg = data['Codice Regione'], 
                nomeRegione = data['Denominazione Regione'],
                provIso2 = data['Sigla automobilistica'];
            
            codiceReg = codiceReg.replace('\n','');
            mappa_ProvIso2_Regione.set(provIso2, nomeRegione);

            break;

        case 'end':
            break;

        default:
            console.error(`Event type '${eventType}' not implemented.`);
    }
}

/** @returns {boolean} */
function isDatabasesLoaded_ElencoComuniItaliani(){
    return mappa_ProvIso2_Regione.size>0;
}

function clearElencoComuniItaliani(){
    console.log("Clean of 'mappa_ProvIso2_Regione' MAP")
    mappa_ProvIso2_Regione.clear();
}

/**
 * Example: 'PA' => 'Sicilia' 
 * @param {string} iso2Provincia 
 * @returns {string}
 */
function getNomeRegione(iso2Provincia){
    let ret = mappa_ProvIso2_Regione.get(iso2Provincia)
    if(ret!==undefined)
        return ret;
    
    throw new Error(`Sigla '${iso2Provincia}' non esistente.`);
}
module.exports.getNomeRegione = getNomeRegione;

// ======================================================================================