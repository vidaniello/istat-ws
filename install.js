#!/usr/bin/env node

const common = require('./common');

console.log("INSTALL SCRIPT: Check dirs...");
common.checkAndCreateDirs();

/** @type {string} */
let envContent = "# .env file generated with install script on "+new Date()+"\n";

console.log("INSTALL SCRIPT: Load argv from command line...");
for(let arg of process.argv){
    if(arg.includes("="))
        envContent += arg+"\n";
}

console.log("INSTALL SCRIPT: Write .env file...");
common.cleanAndWriteEnvFile(envContent);


console.log("INSTALL SCRIPT: Setup end.");