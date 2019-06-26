const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL
} = require('@azure/storage-blob')

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
  let blobName = ''
  const content = file.data
  const fileType = file.mimetype
  console.log('runBlobStorage:', file)
  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
  const pipeline = StorageURL.newPipeline(credentials)
  const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)

  const draftFileName = `${type}-${id}_draft.${file.name.split('.')[1]}`

  console.log('Containers:', file)
  await showContainerNames(aborter, serviceURL)
  await renameBlob()
  if (fileType !== 'text/html') {
    if (saveCopyOfFile === 'true') {
      blobName = `${type}-${id}-${getTodayDate()}.${file.name.split('.')[1]}`
    } else {
      blobName = draftFileName
    }
    const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName)
    // TODO: const blockBlobURL_oldFile = BlockBlobURL.fromContainerURL(containerURL, draftFileName)
    // const downloadResponse = await blockBlobURL_oldFile.download(aborter, 0)
    const resp = await blockBlobURL.upload(aborter, content, content.length)
    log.info(`Blob "${blobName}" is uploaded`, resp)
    await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })
    file.name = blobName
    return file
  }

  /* console.log(`Blobs in "${containerName}" container:`) */
  await showBlobNames(aborter, containerURL, blobName)
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

async function showBlobNames (aborter, containerURL, fileName) {
  let response
  let marker

  do {
    response = await containerURL.listBlobFlatSegment(aborter)
    marker = response.marker
    for (let blob of response.segment.blobItems) {
      if (blob.name === fileName) {
        console.log(` - ${blob.name}`)
      }
    }
  } while (marker)
}

const getTodayDate = (date = '') => {
  let today = date.length > 0 ? new Date(date) : new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  return yyyy + mm + dd + '-' + hh + '-' + min
}
