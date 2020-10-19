const { BlobServiceClient } = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('kth-node-log')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const getTodayDate = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()
  const hh = today.getHours()
  const min = today.getMinutes()

  return yyyy + mm + dd + '-' + hh + '-' + min
}

const STORAGE_CONTAINER_NAME = serverConfig.fileStorage.kursutvecklingStorage.containerName

const BLOB_SERVICE_SAS_URL = serverConfig.fileStorage.kursutvecklingStorage.blobServiceSasUrl

const blobServiceClient = new BlobServiceClient(BLOB_SERVICE_SAS_URL)

async function runBlobStorage(file, id, type, saveCopyOfFile, metadata) {
  const blobName = `${type}-${id.replace('_', '-')}-${getTodayDate()}.${file.name.split('.')[1]}`
  const content = file.data
  const fileType = file.mimetype

  const uploadResponse = await uploadBlob(blobName, content, fileType, metadata)
  log.debug(' Blobstorage - uploaded file response ', uploadResponse)

  return blobName
}

//* *********************************************************************** */

async function uploadBlob(blobName, content, fileType, metadata = {}) {
  const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  try {
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length)
    log.debug(`Blobstorage - Upload block blob ${blobName} `)

    await blockBlobClient.setHTTPHeaders({ blobContentType: fileType })
    metadata.datetime = new Date().toISOString()
    await blockBlobClient.setMetadata(metadata)
    log.debug(`Blobstorage - Blob has been uploaded to kursutveckling blob storage:  ${blobName} `)
    return uploadBlobResponse
  } catch (error) {
    log.error('Error when uploading file in blobStorage: ' + blobName, { error: error })
    return error
  }
}

async function updateMetaData(blobName, metadata) {
  const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)

  metadata.datetime = new Date().toISOString()

  log.debug(`Update metadata for ${blobName}`)
  try {
    const response = await blockBlobClient.setMetadata(metadata)
    return response
  } catch (error) {
    log.error('Error in update metadata in kursutveckling blobstorage: ' + blobName, { error })
    return error
  }
}

async function deleteBlob(analysisId) {
  log.debug(`Kursutveckling blob storage - Delete file: ${analysisId}`)
  try {
    const containerClient = blobServiceClient.getContainerClient(STORAGE_CONTAINER_NAME)
    const blockBlobClient = containerClient.getBlockBlobClient(analysisId)
    const responseDelete = await blockBlobClient.delete()

    log.debug(
      responseDelete.length + ' file(s) deleted from kursutveckling blob storage with analysisId: ' + analysisId,
      responseDelete
    )

    return responseDelete
  } catch (error) {
    log.error('Error in deleting blob ', { error: error })
    return error
  }
}

module.exports = {
  runBlobStorage,
  updateMetaData,
  deleteBlob,
}
