if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const path = require('path')
const storage = require('azure-storage')

const blobService = storage.createBlobService()
const container = 'kursutveckling-blob-container'
const blobName = 'atest6.pdf'
module.exports = {
  blobStorageUpload: blobStorageUpload
}

async function blobStorageUpload () {
  console.log('Containers:')

  // await listContainers()
  async function execute () {
    let response1 = await downloadBlob3()

  //   response1.containers.forEach((container) => console.log(` -  ${container.name}`))
  //   const response = await downloadBlob2('kursutveckling-blob-container', 'document.pdf')
  //   console.log(`Downloaded blob content: "${response.text}"`, response)
  }
  execute().then((response) => {
    console.log('Done', response)
    return response
  }).then(function (response) {
    setProperties(blobName, 'application/pdf')
  }

  ).catch((e) => console.log(e))
}

const downloadBlob = async (containerName, blobName) => {
  console.log(blobService)
  const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'))
  return new Promise((resolve, reject) => {
    blobService.getBlobToText(containerName, blobName, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `Blob downloaded "${data}"`, text: data })
      }
    })
  })
}

const downloadBlob2 = async (containerName, blobName) => {
  console.log(blobService)
  const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'))
  return new Promise(async function (resolve, reject) {
    await blobService.getBlobToText(containerName, blobName, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `Blob downloaded "${data}"`, text: data })
      }
    })
  })
}

const downloadBlob3 = async () => {
  let readStream = blobService.createReadStream(container, blobName, (err, res) => {
    if (!err) {
      console.log('createReadStream() successfully', res)
    }
  })
  readStream.on('data', data => {
    console.log(data)
  })
}

const downloadBlob4 = async () => {
  let readStream = blobService.createReadStream(container, blobName, (err, res) => {
    if (!err) {
      console.log('createReadStream() successfully', res)
    }
  })
  readStream.on('data', data => {
    console.log(data)
  })

  let writeStreamToNewBlob = await blobService.createWriteStreamToBlockBlob(container, blobName, (err, res) => {
    if (!err) {
      console.log('createWriteStreamToBlockBlob successfully!' )
    }
  })

  const response = await blobService.getBlobToStream(container, 'document.pdf', writeStreamToNewBlob, async function (err, res) {
    if (!err) {
      console.log('getBlobToStream successfully')
      // await blobService.getBlobProperties(
      //   container,
      //   blobName,
      //   function (err, result, response) {
      //     var properties = result
      //     console.log(result)
      //     properties.contentType = 'application/pdf'
      //     blobService.setBlobProperties(
      //       container,
      //       blobName,
      //       properties,
      //       function (err, result, response) {
      //         console.log('Successfully updated properties for blob %s', blobName)
      //       })
      //   })
    }
    return response
  })
}

const setProperties = async (blobName, contentType) => {
  blobService.getBlobProperties(
    container,
    blobName,
    function (err, result, response) {
      var properties = result
      console.log(result)
      properties.contentType = contentType
      blobService.setBlobProperties(
        container,
        blobName,
        properties,
        function (err, result, response) {
          console.log('Successfully updated properties for blob %s', blobName)
        })
    })
}

const setMetadata = async (blobName, metadata) => {
  blobService.getBlobMetadata(
    containerName,
    blobName,
    function (err, result, response) {
      var metadata = result.metadata
      metadata.hitcount = parseInt(metadata.hitcount || 0) + 1
      blobService.setBlobMetadata(
        containerName,
        blobName,
        metadata,
        function (err, result, response) {
          console.log('Successfully updated metadata for blob %s', blobName)
        })
    })
}

const listContainers = async () => {
  return new Promise((resolve, reject) => {
    blobService.listContainersSegmented(null, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `${data.entries.length} containers`, containers: data.entries })
      }
    })
  })
}
