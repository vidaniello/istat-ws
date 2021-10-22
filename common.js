const fs = require('fs');
const rawdataconfig = require('./rawdataconfig.json');

/** @type {string} */
const FILE_READY_TOPIC = "FILE_READY_TOPIC";
module.exports.FILE_READY_TOPIC = FILE_READY_TOPIC;

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
    descrizione;

    /** @type {string} */
    url;

    /** @type {string} */
    filename;

    /** @type {string} */
    filetype;

    options;

    getUrl(){
        return this.url;
    } 

    getFilenameWithPath(){
        return `${DATA_DIR_PATH}${this.filename}`;
    }

    getDescrizione(){
        return this.descrizione;
    }

    getFiletype(){
        return this.filetype;
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
