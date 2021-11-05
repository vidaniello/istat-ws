const express = require('express');
const common = require('./common');
const database = require('./database');
const httpstatuscodes = require('http-status-codes')
const app = express();

/** @type {number} */
const defPort = 5050;

const textPlain = "text/plain";

function initHttpServer(){

    if(process.env.PORT===undefined)
        process.env.PORT = defPort;
    
    app.use(express.json());
    app.listen(process.env.PORT, ()=>{
        console.log("Http-server listen on port "+process.env.PORT)
    });
}
module.exports.initHttpServer = initHttpServer;


app.get("/", (req,resp)=>{
    resp.send("Ok! ver."+common.getVersion()+", date "+new Date());
});

app.get(`/${common.getNomeRegione}/:${common.iso2Provincia}`, (req,resp)=>{
    
    /**@type {string} */
    let iso2ProAbbr = req.params[common.iso2Provincia];

    try {
        resp.contentType(textPlain);
        resp.send(database.getNomeRegione(iso2ProAbbr));
    } catch (error) {
        resp.status(httpstatuscodes.StatusCodes.FORBIDDEN)
            .send(`the iso2 province abbreviation ${iso2ProAbbr} not exist.`);
    }
});