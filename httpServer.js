const express = require('express');
const database = require('./database');
const app = express();

function initHttpServer(){
    app.use(express.json());
    app.listen(process.env.PORT, ()=>{});
}
module.exports.initHttpServer = initHttpServer;