# Welcome to kursutveckling-admin-web 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

**Kursutveckling-admin-web** is

> En app som ger stöd för att publicera information om kursens utveckling i Kurs- och programkatalogen. Sidan innehåller tjänster för att publicera kursanalyser med kursdata för en specifik kurs.

The app is based on [https://github.com/KTH/node-web](https://github.com/KTH/node-web).

### 🏠 [Homepage](https://github.com/KTH/kursutveckling-admin-web)

## Overview

Firstly, the app has two functions:

- to upload a course analysis and historic course memo pdf files to a blob storage and send course data about it to `kursutveckling-api`.
- to change a published course data analysis
- automatic fill in data about course development fetching from kopps-api and kursstatistik api (reading from ladok db)

Later this files and course development data can be found on public pages 'Course development' served by `kursutveckling-web`.

User can choose several course offerings and edit fetched course data it will be noted that data were changed manually. Pdf files upload to a blob storage while in a database data about file and course offering will be saved with a list of course offerings.

- The app consists of two pages which is used to create a new course development data and to change a published one. To do it user will go through three step: Choose a course offering(s), write data, upload a course analysis pdf file, optionally course memo pdf file (history), review it, save it as a draft or publish it.

```
localhost:3000/kursinfoadmin/kursutveckling/:courseCode
```

- There is a page called Preview, which is used to show a draft data to a person who gets a link and has other type of teacher rights to access this course, only read rights

```
localhost:3000/kursinfoadmin/kursutveckling/:preview/:id
```

### API:s

Application is fetching data from KOPPS-API for:

- Course title
- Course offerings which are/were active for this course

Application is fetching data from KURSUTVECKLING-API for:

- Fetch course offerings which have a draft or published version of course data to sort per termin and filter course offerings fetched from KOPPS-API.

- Fetch course data and pdf names for chosen course offerings if user want to change it

- [https://github.com/KTH/kurs-pm-api](https://github.com/KTH/kurs-pm-api)

Application is fetching data from KURSSTATISTIK-API for:

- Fetch data and calculate result, number of students and so on from LADOK database

- [https://github.com/KTH/kursstatistik-api](https://github.com/KTH/kursstatistik-api)

Application is fetching data from ug-rest-api:

- Fetch data about course staff (because some information missing in Kopps, f.e., examinators)

- Base authorization who can see which pages

### Related projects

- [https://github.com/KTH/kursutveckling-web](https://github.com/KTH/kursutveckling-web)
- [https://github.com/KTH/kursutveckling-api](https://github.com/KTH/kursutveckling-api)
- [https://github.com/KTH/kursstatistik-api](https://github.com/KTH/kursstatistik-api)
- [https://gita.sys.kth.se/Infosys/ugcache](https://gita.sys.kth.se/Infosys/ugcache)

We must try to make changes that affect the template projects in the template projects themselves.

- [https://github.com/KTH/node-web](https://github.com/KTH/node-web)

## Prerequisites

- node 18

### Blob storage. Generate Shared access signature

- blob container (STORAGE_CONTAINER_NAME) `kursutveckling-blob-container`
- Allowed permissions: _Read, Write, Create_

While images uploads directly to a blob container located in a cloud in the storage account, f.e., `kursinfostoragestage`, the name of uploaded image will be saved in `kurs-pm-api`.
To connect to blob storage, the Shared access signature is used to limit what can be done by using this signature, f.e., only read, or write and which services. In stage environment keys were generated on base of key2.
For each service generated a separate Shared access signature and saved(f.e., SAS-REF-blob-service-sas-url-kursutveckling-admin-web) in standard key vault.

It requires package `"@azure/storage-blob": "^12.2.1"`. Further to parse a file between client and server, you need to have npm package `body-parser`. More details in `server/blobStorage.js`.

#### Blob storage. Generate Shared access signature

To generate it, go to a storage account, f.e., `kursinfostoragestage`, choose Shared Access signature and choose:

- Allowed services: _Blob_
- Allowed resource types: _Object_
- Allowed permissions: _Read, Write, Create_
- Start and expiry date/time
- HTTPS only
- Signing key: key1 or key2

After a generation of a key, copy **Blob service SAS URL** and save it in a standard key vault and set **Expiration Date**.
Later you will use it as a _BLOB_SERVICE_SAS_URL_ in secrets together with a name of blob container STORAGE_CONTAINER_NAME

### Secrets for Development

Secrets during local development are ALWAYS stored in a `.env`-file in the root of your project. This file should be in .gitignore.

IMPORTANT: In Prod env, save URL:s in docker file but secrets in secrets.env

```
KOPPS_URI=https://api-r.referens.sys.kth.se/api/kopps/v2/?defaultTimeout=5000
KURSUTVECKLING_API_URI=http://localhost:3003/api/kurs-pm [check api port]
API_KEY=[secret key to connect to kursutveckling-api]
KURSSTATISTIK_API_URI=https://localhost:[api port]/api/kursstatistik?defaultTimeout=100000
KURSSTATISTIK_API_KEY=[secret key to connect to kursstatistik-api]
SESSION_SECRET=[something random]
SESSION_KEY=kursutveckling-admin-web.pid
OIDC_APPLICATION_ID=<FROM ADFS>
OIDC_CLIENT_SECRET=<FROM ADFS>
OIDC_TOKEN_SECRET=<Random string>
REDIS_URI=[connection string to redis, for cache]
BLOB_SERVICE_SAS_URL=[f.e., https://kursinfostoragestage.blob.core.windows.net/[params]&spr=https&sig=[generated signature]]
STORAGE_CONTAINER_NAME=kursutveckling-blob-container
/*If you want to start your server on another port, add the following two variables, else use default ones from serversettings.js*/
SERVER_PORT=[your port for the server]
SERVER_HOST_URL=http://localhost:[SERVER_PORT]
LOGGING_LEVEL=DEBUG [only for dev env]
/* Connection Properties of UG Rest Api to fetch names of course staff */
UG_REST_AUTH_API_TOKEN_URI=https://<LOGIN_HOST>/adfs/
UG_REST_AUTH_CLIENT_ID=<FROM AZURE KEYVAULT>
UG_REST_AUTH_CLIENT_SECRET=<FROM AZURE KEYVAULT>
UG_REST_API_URI=https://<UG_URL>
UG_REST_API_SUBSCRIPTION_KEY=<FROM AZURE INTEGRAL OR KEYVAULT>
```

These settings are also available in an `env.in` file.

### Install

First time you might need to use options `--ignore-scripts` because of npm resolutions:

```sh
npm install --ignore-scripts
```

or

```sh
npm install

```

You might need to install as well:

```sh
npm install cross-env
npm install concurrently
```

### Usage

Start the service on [http://localhost:3000/kursinfoadmin/kursutveckling/:courseCode](http://localhost:3000/kursinfoadmin/kursutveckling/:courseCode).

```sh
npm run start-dev
```

### Debug in Visual Studio Code

It's possible to use debugging options available in Visual Studio Code
Add a file `launch.json` to `.vscode` directory :

- _Microsoft_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursutveckling-admin-web",
      "program": "${workspaceFolder}\\app.js",
      "envFile": "${workspaceFolder}\\.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

- _Mac, Unix and so on_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kursutveckling-admin-web",
      "program": "${workspaceFolder}/app.js",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Run tests

```sh
npm run test
```

## Use 🐳

`API_KEY` in `docker-compose.yml` is configured for a local kurs-pm-api, and might as well be changed to kurs-pm-api in ref.

```sh
docker-compose up
```

## Customizations

### Handlebar Templates

_Update 2021-03-12: Dependency to `kth-node-build-commons` has since been removed altogether._

> Paths in the app have been altered, so the use of _Handlebar_ templates has been customized. The files `errorLayout.handlebars` and `error.handlebars` were copied from `kth-node-build-commons`. This meant that the script `move-handlebars` could be removed from `package.json`. In `errorLayout.handlebars` the path for `vendor.js` was customized, and in `error.handlebars` the reference to `errorModule.js` was removed altogether.

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
