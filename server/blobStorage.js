
const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  BlobURL,
  BlobDownloadResponse,
  downloadBlobToBuffer
} = require('@azure/storage-blob')

const serverConfig = require('./configuration').server
const log = require('kth-node-log')
const fs = require('fs')

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

async function runBlobStorage (file, id, type, saveCopyOfFile, metadata) {
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

  // console.log('Containers:', file)
  // await showContainerNames(aborter, serviceURL)
  // await changeBlobName(aborter, containerURL, draftFileName)
  if (type === 'analysis') {
    const draftFileName = `${type}-${id}_draft.${file.name.split('.')[1]}`
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
  // var test = await changeBlobName(aborter, containerURL, draftFileName, newFileName)
  // file.name = blobName
  return blobName

  // console.log('!TEST', test, test.readableBuffer)

  // const newBlobURL = BlobURL.fromContainerURL(containerURL, 'testar.pdf')
  // console.log('UP!!!!', test)
  // const blockBlobURL = BlockBlobURL.fromBlobURL(newBlobURL)
  // const uploadBlobResponse = await blockBlobURL.upload(
  //   aborter.none,
  //   await test.readableBuffer.toString,
  //   await test.readableLength
  // // )
  // await blockBlobURL.setHTTPHeaders(aborter, { blobContentType: fileType })
  // console.log('Upp!!!!', uploadBlobResponse, blockBlobURL)

  // await showBlobNames(aborter, containerURL, blobName)
}

//* *********************************************************************** */

async function uploadBlob (aborter, containerURL, blobName, content, fileType, metadata = {}) {
  const blobURL = BlobURL.fromContainerURL(containerURL, blobName)
  const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL)
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
  await blockBlobURL.setMetadata(aborter, { date: getTodayDate(), courseCode: metadata.courseCode, analysis: metadata.analysis })
  console.log('blockBlobURL', blockBlobURL)

  return uploadBlobResponse
}

async function changeBlobName (aborter, containerURL, draftFileName, newFileName) {
  let response
  let marker

  const oldBlockBlobURL = BlockBlobURL.fromContainerURL(containerURL, draftFileName)
  console.log('DOWN 1!!!!', oldBlockBlobURL)
  const downloadResponse = await oldBlockBlobURL.download(aborter, 0)

  const downloadedContent = await downloadResponse.readableStreamBody// blobDownloadStream
  return downloadedContent
  var test = 'await streamToString(downloadedContent)'
  console.log('DOWN!!!!', downloadedContent, test)

  const newBlobURL = BlobURL.fromContainerURL(containerURL, 'testar.pdf')
  console.log('UP!!!!', downloadResponse)
  const blockBlobURL = BlockBlobURL.fromBlobURL(newBlobURL)
  const uploadBlobResponse = await blockBlobURL.upload(
    aborter.none,
    await downloadedContent.readableBuffer,
    await downloadedContent.readableBuffer.readableLength
  )
  console.log('Upp!!!!', uploadBlobResponse)

  // console.log(
  //   "Downloaded blob content",
  //   await streamToString(downloadResponse.readableStreamBody)
  // )
  // const blockBlobURLnew = await BlockBlobURL.fromContainerURL(containerURL, 'newNameTest!!!!!.pdf')
  // console.log('changeBlobName1:', downloadResponse.blobDownloadStream.source, downloadResponse.blobDownloadStream.source.readableBuffer)
  // const resp = await blockBlobURLnew.upload(aborter, downloadResponse.blobDownloadStream.source.readableBuffer.BufferList.head.data, downloadResponse.blobDownloadStream.source.readableBuffer.BufferList.head.data.length)
  // console.log('changeBlobName2:', resp)
  // do {
  //   response = await containerURL.listBlobFlatSegment(aborter)
  //   marker = response.marker
  //   for (let blob of response.segment.blobItems) {
  //     if (blob.name === draftFileName) {
  //       console.log(` changeBlobName: ${blob}`, blob)
  //     }
  //   }
  // } while (marker)
  return newFileName
}

// async function showBlobNames (aborter, containerURL, fileName) {
//   let response
//   let marker
//   do {
//     response = await containerURL.listBlobFlatSegment(aborter)
//     marker = response.marker
//     for (let blob of response.segment.blobItems) {
//       if (blob.name === fileName) {
//         console.log(` - ${blob.name}`)
//       }
//     }
//   } while (marker)
// }

// async function showContainerNames (aborter, serviceURL) {
//   let response
//   let marker

//   do {
//     response = await serviceURL.listContainersSegment(aborter, marker)
//     marker = response.marker
//     for (let container of response.containerItems) {
//       console.log(` - ${container.name}`)
//     }
//   } while (marker)
// }

async function streamToString (readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', data => {
      chunks.push(data.toString())
    })
    readableStream.on('end', () => {
      resolve(chunks.join(''))
    })
    readableStream.on('error', reject)
  })
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
