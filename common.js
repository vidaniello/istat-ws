const fs = require('fs');
const rawdataconfig = require('./rawdataconfig.json');

/** @type {string} */
const FILE_READY_TOPIC = "INIT_DATASOURCE_TOPIC";
module.exports.INIT_DATASOURCE_TOPIC = INIT_DATASOURCE_TOPIC;

/** @type {string} */
const FILE_READY_TOPIC = "FILE_READY_TOPIC";
module.exports.FILE_READY_TOPIC = FILE_READY_TOPIC;

/** @type {string} */
const DATABASE_READY_TOPIC = "DATABASE_READY_TOPIC";
module.exports.DATABASE_READY_TOPIC = DATABASE_READY_TOPIC;

const DATA_DIR_PATH = "./data/";
module.exports.DATA_DIR_PATH = DATA_DIR_PATH;

console.log(`INFO check of ${DATA_DIR_PATH} dir`);
if(!fs.existsSync(DATA_DIR_PATH)){
    fs.mkdirSync(DATA_DIR_PATH);
    console.log(`INFO dir ${DATA_DIR_PATH} created`);
}else{
    console.log(`INFO dir ${DATA_DIR_PATH} exist`);
}


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

/** 
 * @type {Source} Loaded from rawdataconfig
 */
const COMUNI_ITALIANI = Object.setPrototypeOf(rawdataconfig.common_Source_comuniItaliani, Source.prototype);
module.exports.COMUNI_ITALIANI = COMUNI_ITALIANI;
const PROC_COMUNI_ITALIANI = COMUNI_ITALIANI.getCode();
module.exports.PROC_COMUNI_ITALIANI = PROC_COMUNI_ITALIANI;

/**
 * @type {Set<Source>}
 */
const allDataSource = new Set();
module.exports.allDataSource = allDataSource;
allDataSource.add(COMUNI_ITALIANI);

function initAllDataSources(){
    for()
}
module.exports.initAllDataSources = initAllDataSources;