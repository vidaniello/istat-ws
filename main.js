const downloader = require('./downloader');

const urlComuniItalianiCsv = "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.csv";
const fileNameComuniItaliani = "Elenco-comuni-italiani.csv";

downloader.initDataRaw(fileNameComuniItaliani, urlComuniItalianiCsv);