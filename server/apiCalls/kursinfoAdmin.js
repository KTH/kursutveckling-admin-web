'use strict'

const api = require('../api')

module.exports = {
  getRoundData: _getRoundData,
  setRoundData: _setRoundData
}

function _getRoundData (id) {
  /* const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.getSellingTextByCourseCode.uri,{ courseCode: courseCode })
  return client.getAsync({uri: uri})*/
}

async function _setRoundData (sendObject, id) {
  /* const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.postImageInfo.uri,{courseCode: courseCode})
  return await client.postAsync({uri: uri, body: sendObject})*/
}
