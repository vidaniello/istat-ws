const express = require('express');
const database = require('./database');
const app = express();

/** @type {number} */
const defPort = 5050;

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
    resp.send("Ok! "+new Date());
});