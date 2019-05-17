const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadFileToBlockBlob
} = require('@azure/storage-blob')

const fs = require('fs')
const path = require('path')
const serverConfig = require('./configuration').server
const log = require('kth-node-log')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  runBlobStorage: runBlobStorage
}

const STORAGE_ACCOUNT_NAME = serverConfig.fileStorage.kursutvecklingStorage.account
const ACCOUNT_ACCESS_KEY = serverConfig.fileStorage.kursutvecklingStorage.accountKey

const ONE_MEGABYTE = 1024 * 1024
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE
const ONE_MINUTE = 60 * 1000

async function runBlobStorage (file, id, type, saveCopyOfFile) {
  const containerName = 'kursutveckling-blob-container'
  const blobName = id + '.' + file.name.split('.')[1]
  const content = file.data
  const fileType = file.mimetype
  console.log('runBlobStorage:', file)
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
  const pipeline = StorageURL.newPipeline(credentials)
  const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName)

  const aborter = Aborter.timeout(30 * ONE_MINUTE)

  console.log('Containers:', file)
  await showContainerNames(aborter, serviceURL)

  const resp = await blockBlobURL.upload(aborter, content, content.length)
  log.info(`Blob "${blobName}" is uploaded`, resp)

  await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })

  /* console.log(`Blobs in "${containerName}" container:`)
  await showBlobNames(aborter, containerURL) */
}

//* *********************************************************************** */
async function showContainerNames (aborter, serviceURL) {
  let response
  let marker

  do {
    response = await serviceURL.listContainersSegment(aborter, marker)
    marker = response.marker
    for (let container of response.containerItems) {
      console.log(` - ${container.name}`)
    }
  } while (marker)
}

async function showBlobNames (aborter, containerURL) {
  let response
  let marker

  do {
    response = await containerURL.listBlobFlatSegment(aborter)
    marker = response.marker
    for (let blob of response.segment.blobItems) {
      console.log(` - ${blob.name}`)
    }
  } while (marker)
}
