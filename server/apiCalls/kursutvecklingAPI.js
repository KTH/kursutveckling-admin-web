'use strict'

const api = require('../api')

module.exports = {
  getRoundAnalysisData: _getRoundData,
  setRoundAnalysisData: _setRoundData
}

function _getRoundData (id) {
  const paths = api.kursutvecklingApi.paths
  console.log('_getRoundData', paths)
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.getCourseRoundAnalysisDataById.uri, { id: id })
  return client.getAsync({uri: uri})
}

async function _setRoundData (id, sendObject) {
  const paths = api.kursutvecklingApi.paths
  console.log('_setRoundData', sendObject)
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.postCourseRoundAnalysisDataById.uri, { id: id })
  return client.postAsync({uri: uri, body: sendObject})
}
