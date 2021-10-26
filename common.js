const fs = require('fs');
const config = require('./istat-ws-config.json');

/** @type {string} */
const CHECK_ETA_TOPIC = "CHECK_ETA_TOPIC";
module.exports.CHECK_ETA_TOPIC = CHECK_ETA_TOPIC;

/** @type {string} */
const NEW_FILE_READY_TOPIC = "NEW_FILE_READY_TOPIC";
module.exports.NEW_FILE_READY_TOPIC = NEW_FILE_READY_TOPIC;

/** @type {string} */
const FILE_READY_TOPIC = "FILE_READY_TOPIC";
module.exports.FILE_READY_TOPIC = FILE_READY_TOPIC;

/** @type {string} */
const DATABASE_READY_TOPIC = "DATABASE_READY_TOPIC";
module.exports.DATABASE_READY_TOPIC = DATABASE_READY_TOPIC;

/** @type {string} */
const DATA_DIR_PATH = "./data/";
module.exports.DATA_DIR_PATH = DATA_DIR_PATH;

/**
 * Class for the datasource declared in the 'config' JSON file.
 */
class Source{

    /** @type {string} */
    code;

    /** @type {string} */
    descrizione;

    /** @type {string} */
    url;

    /** @type {string} */
    filename;

    /** @type {string} */
    filetype;

    /** @type {string} */
    encoding;

    options;

    getCode(){
        return this.code;
    }

    getUrl(){
        return this.url;
    } 

    getFilename(){
        return this.filename;
    }

    getFilenameWithPath(){
        return `${DATA_DIR_PATH}${this.getFilename()}`;
    }

    getDescrizione(){
        return this.descrizione;
    }

    getFiletype(){
        return this.filetype;
    }

    getEncoding(){
        return this.encoding;
    }

    getOptions(){
        return this.options;
    }

}
module.exports.Source = Source;

/**  @type {Source} Loaded from 'config' JSON file */
const COMUNI_ITALIANI = Object.setPrototypeOf(config.common_Source_comuniItaliani, Source.prototype);
module.exports.COMUNI_ITALIANI = COMUNI_ITALIANI;
/** @type {string} */
const PROC_COMUNI_ITALIANI = COMUNI_ITALIANI.getCode();
module.exports.PROC_COMUNI_ITALIANI = PROC_COMUNI_ITALIANI;

/** @type {Set<Source>} */
const allDataSource = new Set();
module.exports.allDataSource = allDataSource;
allDataSource.add(COMUNI_ITALIANI);




/** @type {string} */
const iso2Provincia = "iso2Provincia";
module.exports.iso2Provincia = iso2Provincia;




/**
 * Init function
 */
function _init(){
    console.log(`INFO check of ${DATA_DIR_PATH} dir`);
    if(!fs.existsSync(DATA_DIR_PATH)){
        fs.mkdirSync(DATA_DIR_PATH);
        console.log(`INFO dir ${DATA_DIR_PATH} created`);
    }else{
        console.log(`INFO dir ${DATA_DIR_PATH} exist`);
    }
}
module.exports.init = _init();
