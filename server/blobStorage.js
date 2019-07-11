
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  BlobURL
} = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('kth-node-log')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  runBlobStorage: runBlobStorage,
  updateMetaData: updateMetaData,
  deleteBlob: deleteBlob
}

const STORAGE_ACCOUNT_NAME = serverConfig.fileStorage.kursutvecklingStorage.account
const ACCOUNT_ACCESS_KEY = serverConfig.fileStorage.kursutvecklingStorage.accountKey

const ONE_MEGABYTE = 1024 * 1024
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE
const ONE_MINUTE = 60 * 1000

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
const pipeline = StorageURL.newPipeline(credentials)
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

async function runBlobStorage (file, id, type, saveCopyOfFile, metadata) {
  const containerName = 'kursutveckling-blob-container'
  let blobName = ''
  const content = file.data
  const fileType = file.mimetype
  console.log('runBlobStorage:', file)

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)

  if (type === 'analysis') {
    const draftFileName = `${type}-${id}.${file.name.split('.')[1]}`
    const newFileName = `${type}-${id}-${getTodayDate()}.${file.name.split('.')[1]}`
    if (saveCopyOfFile === 'true') {
      blobName = newFileName
    } else {
      blobName = draftFileName
    }
  } else {
    blobName = `${type}-${id}.${file.name.split('.')[1]}`
  }

  const uploadResponse = await uploadBlob(aborter, containerURL, blobName, content, fileType, metadata)
  console.log('!!!', uploadResponse)

  return blobName
}

//* *********************************************************************** */

async function uploadBlob (aborter, containerURL, blobName, content, fileType, metadata = {}) {
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  try {
    const uploadBlobResponse = await blockBlobURL.upload(
      aborter.none,
      content,
      content.length
    )
    console.log(
      `Upload block blob ${blobName} successfully`,
      uploadBlobResponse.requestId
    )
    await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })
    metadata['date'] = getTodayDate(false)
    await blockBlobURL.setMetadata(
      aborter,
      metadata
    )
    console.log('blockBlobURL', blockBlobURL)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error: error })
    return error
  }
}

async function updateMetaData (blobName, metadata) {
  const containerName = 'kursutveckling-blob-container'
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  const dateAndTime = new Date()
  metadata['date'] = getTodayDate(false)
  try {
    const response = await blockBlobURL.setMetadata(
      aborter,
      metadata
    )
    return response
  } catch (error) {
    log.error('Error in update metadata in blobstorage: ' + blobName, { error: error })
    return (error)
  }
}

async function deleteBlob (blobName, metadata) {
  const containerName = 'kursutveckling-blob-container'
  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
  const dateAndTime = new Date()
  await blockBlobURL.setMetadata(
    aborter,
    {
      date: dateAndTime,
      status: metadata.status
    }
  )
}

const getTodayDate = (fileDate = true) => {
  let today = new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()
  let hh = today.getHours()
  let min = today.getMinutes()

  return fileDate ? yyyy + mm + dd + '-' + hh + '-' + min : yyyy + mm + dd + '-' + hh + ':' + min
}
