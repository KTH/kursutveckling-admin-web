# Welcome to kursutveckling-admin-web 👋

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000)
![Prerequisite](https://img.shields.io/badge/node-10.14.0-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

Kursutveckling-admin-web is 

> En app som ger stöd för att publicera information om kursens utveckling och historik i Kurs- och programkatalogen. Sidan innehåller tjänster för att publicera kursanalyser med kursdata för en specifik kurs.

The app is based on [https://github.com/KTH/node-web](https://github.com/KTH/node-web).

### 🏠 [Homepage](https://github.com/KTH/kursutveckling-admin-web)

## Overview

TBW

### API:s

TBW

### Related projects

TBW

## Prerequisites

- Node.js 10.14.0
- Ansible Vault

### Secrets for Development

TBW

## Install

```sh
npm install
```

## Usage

```sh
npm run start-dev
```

## Run tests

```sh
npm run test
```

## Use 🐳

TBW

## Customizations

### Handlebar Templates

Paths in the app have been altered, so the use of _Handlebar_ templates has been customized. The files `errorLayout.handlebars` and `error.handlebars` were copied from `kth-node-build-commons`. This meant that the script `move-handlebars` could be removed from `package.json`. In `errorLayout.handlebars` the path for `vendor.js` was customized, and in `error.handlebars` the reference to `errorModule.js` was removed altogether.

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
