# Istat WS

Endpoint web service for static files on the [istat.it](https://www.istat.it/) site

## Processed files

- [Elenco comuni italiani](https://www.istat.it/it/archivio/6789)

## Offered services

- GET */getNomeRegione?iso2Provincia=[iso2 codice provincia]*
    - return a string represent the region of the province, or error 403 if no code finded.

## Setup

Write a `.env` file in the root and add a prop variable named `PORT`, who represent the listen port of the webservice server.