const https = require('https');
const fs = require('fs');
const csv = require('./database');
const eventBus = require('js-event-bus')();

const dataDir = "data/";

let init = false;

if(!init){
    console.log(`INFO check of ${dataDir} dir`);
    if(!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir);
        console.log(`INFO dir ${dataDir} created`);
    }else{
        console.log(`INFO dir ${dataDir} exist`);
    }
    init = true;
}



/**
 * Check the existence of the file, download if not exist or check eta if it exist.
 * @param {*} filename 
 * @param {*} url 
 */
function initDataRaw(filename, url){
    filename = `${dataDir}${filename}`;
    fs.access(filename, fs.constants.F_OK, (err) =>{
        if(err){
            console.log(`INFO file ${filename} not exist, try to download...`);
            download(url, filename);
        }else{
            console.log(`INFO file ${filename} exist, checking eta...`);
            checkEta(url, filename);
        }
    });
}
module.exports.initDataRaw = initDataRaw;

function download(url, filename){
    console.log(`INFO download of ${url} and save to ${filename}...`);
    let file = fs.createWriteStream(filename);
    https.get(url, (res)=>{
        res.pipe(file);
        file.on("finish", ()=>{
            file.close();
            fs.writeFileSync(`${filename}.eta`, res.headers['last-modified']);
            console.log(`INFO download of ${url} and save to ${filename} success`);
            afterDownload(filename);
        });
    })
    .on("error", (err)=>{
        console.log(`ERROR download of ${url} failed: ${err.message}`);
        //create a system who try to re-download if failed
    });
}

function checkEta(url, filename){
    if(!fs.existsSync(filename+".eta")){
        console.log(`ERROR file ${filename} exist but '.eta' not, try to re-download ${url}`)
        download(url, filename);
    }else{
        //check eta
        var etaOfFile = fs.readFileSync(filename+".eta");
        console.log(`INFO eta of file ${filename} is: ${etaOfFile}`);
        https.get(url, (res)=>{
            let etaOfUrl = res.headers['last-modified'];
            if(etaOfFile!=etaOfUrl){
                console.log(`WARN eta of file ${filename} is not equal to eta of url ${url}: ${etaOfFile}!=${etaOfUrl}, download...`)
                download(url, filename);
            }else{
                console.log(`INFO eta of file ${filename} is equal to eta of url ${url}: ${etaOfFile}==${etaOfUrl}`)
                afterDownload(filename);
            }
        })
        .on("error", (err)=>{
            console.log(`ERROR checking eta of ${url} failed: ${err.message}`);
            //create a system who try to re-checking eta if failed
        });
    }
}

function afterDownload(filename){
    eventBus.emit('fileDownloaded');
}