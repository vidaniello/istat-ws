const https = require('https');
const fs = require('fs');
const pubsub = require('pubsub-js');
const csv = require('./database');
const common = require('./common');


/**
 * Check the existence of the file, download if not exist or check eta if it exist.
 * @param {common.Source} source Type of common.Source
 */
function initDataRaw(source){
    
    let filename = source.getFilenameWithPath();
    let url = source.getUrl();

    fs.access(filename, fs.constants.F_OK, (err) =>{
        if(err){
            console.log(`INFO file ${filename} not exist, try to download...`);
            download(source);
        }else{
            console.log(`INFO file ${filename} exist, checking eta...`);
            checkEta(source);
        }
    });
}
module.exports.initDataRaw = initDataRaw;

/**
 * 
 * @param {common.Source} source 
 */
function download(source){

    let filename = source.getFilenameWithPath();
    let url = source.getUrl();

    console.log(`INFO download of ${url} and save to ${filename}...`);
    let file = fs.createWriteStream(filename);
    https.get(url, (res)=>{
        res.pipe(file);
        file.on("finish", ()=>{
            file.close();
            fs.writeFileSync(`${filename}.eta`, res.headers['last-modified']);
            console.log(`INFO download of ${url} and save to ${filename} success`);
            afterDownloadOrCheck(source);
        });
    })
    .on("error", (err)=>{
        console.log(`ERROR download of ${url} failed: ${err.message}`);
        //create a system who try to re-download if failed
    });
}

/**
 * 
 * @param {common.Source} source 
 */
function checkEta(source){

    let filename = source.getFilenameWithPath();
    let url = source.getUrl();
    
    if(!fs.existsSync(filename+".eta")){
        console.log(`ERROR file ${filename} exist but '.eta' not, try to re-download ${url}`)
        download(source);
    }else{
        //check eta
        var etaOfFile = fs.readFileSync(filename+".eta");
        console.log(`INFO eta of file ${filename} is: ${etaOfFile}`);
        https.get(url, (res)=>{
            let etaOfUrl = res.headers['last-modified'];
            if(etaOfFile!=etaOfUrl){
                console.log(`WARN eta of file ${filename} is not equal to eta of url ${url}: ${etaOfFile}!=${etaOfUrl}, download...`)
                download(source);
            }else{
                console.log(`INFO eta of file ${filename} is equal to eta of url ${url}: ${etaOfFile}==${etaOfUrl}`)
                afterDownloadOrCheck(source);
            }
        })
        .on("error", (err)=>{
            console.log(`ERROR checking eta of ${url} failed: ${err.message}`);
            //create a system who try to re-checking eta if failed
        });
    }
}

/**
 * 
 * @param {common.Source} source 
 */
function afterDownloadOrCheck(source){
    pubsub.publish(common.FILE_READY_TOPIC, source);
}