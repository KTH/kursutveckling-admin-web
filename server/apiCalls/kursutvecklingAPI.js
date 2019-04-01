'use strict'

const api = require('../api')

module.exports = {
  getRoundAnalysisData: _getAnalysisData,
  setRoundAnalysisData: _setAnalysisData,
  updateRoundAnalysisData: _putAnalysisData
}

function _getAnalysisData (id) {
  const paths = api.kursutvecklingApi.paths
  console.log('_getRoundData', paths)
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.getCourseRoundAnalysisDataById.uri, { id: id })
  return client.getAsync({ uri: uri })
}

async function _setAnalysisData (id, sendObject) {
  const paths = api.kursutvecklingApi.paths
  console.log('_setRoundData', sendObject)
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.postCourseRoundAnalysisDataById.uri, { id: id })
  return client.postAsync({ uri: uri, body: sendObject })
}

async function _putAnalysisData (id, sendObject) {
  const paths = api.kursutvecklingApi.paths
  console.log('_putRoundData', paths)
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.putCourseRoundAnalysisDataById.uri, { id: id })
  return client.putAsync({ uri: uri, body: sendObject })
}
