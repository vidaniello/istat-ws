const dotenv = require('dotenv');
const fs = require('fs');
const os = require('os');
const path = require('path')
const config = require('./istat-ws-config.json');
const package = require('./package.json');

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

/**@returns {string} */
function getBasePath(){
    return `${os.homedir()}${path.sep}.${package.name}`;
}

/**@returns {string} */
function getDataDirPath(){
    return `${getBasePath()}${path.sep}data`;
}

/**@returns {string} */
function getDotEnvFilePath(){
    return `${getBasePath()}${path.sep}.env`;
}

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
        return `${getDataDirPath()}${path.sep}${this.getFilename()}`;
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

    //Loading of .env file
    if(fs.existsSync(getDotEnvFilePath()))
        dotenv.config({ path: getDotEnvFilePath() });
    else 
        dotenv.config();
    

    checkAndCreateDirs();
}
module.exports.init = _init;

/**
 * Check if the dir '{home dir}/istat-ws' and '{home dir}/istat-ws/data' exist and create it if not.
 */
function checkAndCreateDirs(){
    console.log(`INFO check of ${getBasePath()} dir`);
    if(!fs.existsSync(getBasePath())){
        fs.mkdirSync(getBasePath());
        console.log(`INFO dir ${getBasePath()} created`);
    }else{
        console.log(`INFO dir ${getBasePath()} exist`);
    }

    console.log(`INFO check of ${getDataDirPath()} dir`);
    if(!fs.existsSync(getDataDirPath())){
        fs.mkdirSync(getDataDirPath());
        console.log(`INFO dir ${getDataDirPath()} created`);
    }else{
        console.log(`INFO dir ${getDataDirPath()} exist`);
    }
}
module.exports.checkAndCreateDirs = checkAndCreateDirs;

/**
 * Check if '{home dir}/istat-ws/.env' file exist and delete if. Then, foreach commandline arg
 * write in '{home dir}/istat-ws/.env' file.
 * 
 *  @param {string} content 
 */
function cleanAndWriteEnvFile(content){
    
    if(fs.existsSync(getDotEnvFilePath()))
        fs.rmSync(getDotEnvFilePath());
    
    fs.writeFileSync(`${getDotEnvFilePath()}`, content);
    
}
module.exports.cleanAndWriteEnvFile = cleanAndWriteEnvFile;
