const https = require('https');
const fs = require('fs');
const pubsub = require('pubsub-js');
const common = require('./common');

let token = pubsub.subscribe(common.CHECK_ETA_TOPIC, (msg,data)=>{
    console.log(`topic '${msg}'' called`);
    checkEta(data);
});

/**
 * 
 * @param {common.Source} source 
 */
function checkEta(source){

    let filename = source.getFilenameWithPath();
    let url = source.getUrl();
    
    if(!fs.existsSync(filename)){
        download(source);
    }else if(!fs.existsSync(filename+".eta")){
        console.error(`ERROR file ${filename} exist but '.eta' not, try to re-download ${url}`);
        download(source);
    }else{
        //checking eta
        var etaOfFile = fs.readFileSync(filename+".eta");
        console.log(`INFO eta of file ${filename} is: ${etaOfFile}`);
        https.get(url, (res)=>{
            let etaOfUrl = res.headers['last-modified'];
            if(etaOfFile!=etaOfUrl){
                console.log(`WARN eta of file ${filename} is not equal to eta of url ${url}: ${etaOfFile}!=${etaOfUrl}, try download...`)
                download(source);
            }else{
                console.log(`INFO eta of file ${filename} is equal to eta of url ${url}: ${etaOfFile}==${etaOfUrl}`)
                pubsub.publish(common.FILE_READY_TOPIC, source);
            }
        })
        .on("error", (err)=>{
            console.error(`ERROR checking eta of ${url} failed: ${err.message}`);
            //create a system who try to re-checking eta if failed
        });
    }
}
module.exports.checkEta = checkEta;

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
            console.log(`INFO download of '${url}'' and save to '${filename}'' success`);
            pubsub.publish(common.NEW_FILE_READY_TOPIC, source);
        });
    })
    .on("error", (err)=>{
        console.error(`ERROR download of '${url}'' failed: '${err.message}''`);
        //create a system who try to re-download if failed
    });
}