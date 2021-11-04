# Istat WS

<div style="text-align: center;  margin-bottom: 10px;">
 <img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/vidaniello/istat-ws?color=green">
 <img alt="GitHub" src="https://img.shields.io/github/license/vidaniello/istat-ws">
</div>

Endpoint web service for static files on the [istat.it](https://www.istat.it/) site

## Setup

First install with 
    
    npm install --global git+https://github.com/vidaniello/istat-ws.git

(i've programmed to pubblish in the NPM repo in the future), than type

    istat-ws-install PORT=3000

where `3000` is the http `PORT` env variable writed in the `os.homedir()/istat-ws/.env` file, so it can be changed to any port number you want (80, 8080, 5000, ecc...) For futures updateds, this second call is not required.

After type

    istat-ws

to start the server in interactive mode.

In the case of you need to write the `.env` file in the root of the server, for example it is needed on the glitch.com infrastructure, you can safely, leaving out than the second command `istat-ws-install ...` after the npm installation. In fact the server reads this path as a second choice. 

If the command `istat-ws-install ...` is not called and the `.env` file is not written in the root path, the default port of http server is `5050`.

Advice: use [PM2 process manager](https://pm2.keymetrics.io/) to use it in production.

## Processed files

- [Elenco comuni italiani](https://www.istat.it/it/archivio/6789)


## Offered services

- GET */getNomeRegione?iso2Provincia=[iso2 codice provincia]*
    - return a string represent the region of the province, or error 403 if no code finded.
    - Example: GET http://hostname.tld/getNomeRegione?iso2Provincia=BA, return: *text/plain*, body:{*Puglia*}

*other ws calls in develop progress...*