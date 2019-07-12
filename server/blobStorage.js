
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

async function deleteBlob (analysisId) {
  const containerName = 'kursutveckling-blob-container'
  const aborter = Aborter.timeout(30 * ONE_MINUTE)
  try {
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
    let response
    let marker
    let blobName = ''
    let blobURL
    let blockBlobURL
    let responseDelete = []

    do {
      response = await containerURL.listBlobFlatSegment(aborter)
      marker = response.marker
      for (let blob of response.segment.blobItems) {
        if (blob.name.indexOf(analysisId) > -1) {
          blobURL = BlobURL.fromContainerURL(containerURL, blob.name)
          blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
          responseDelete.push(await blockBlobURL.delete(aborter))
          if (responseDelete.length === 2) {
            break
          }
        }
      }
    } while (marker)
    log.info(responseDelete.length + 'file(s) was deleted from blobstorage with analysisId: ' + analysisId)
    /* if (blobName.length > 0) {
      const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
      const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)

      const response = await blockBlobURL.delete(aborter)

    } */
    return response
  } catch (error) {
    log.error('Error in deleting blob ', { error: error })
    return error
  }
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
