'use strict'

const api = require('../api')

module.exports = {
  getRoundAnalysisData: _getAnalysisData,
  setRoundAnalysisData: _setAnalysisData,
  updateRoundAnalysisData: _putAnalysisData,
  deleteRoundAnalysisData: _deleteAnalysisData,
  getUsedRounds: _getUsedRounds,
  postArchiveFragment: _postArchiveFragment,
  putArchiveFragment: _putArchiveFragment
}

async function _getAnalysisData (id) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.getCourseRoundAnalysisDataById.uri, { id: id })
  return client.getAsync({ uri: uri })
}

async function _setAnalysisData (id, sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.postCourseRoundAnalysisDataById.uri, { id: id })
  return client.postAsync({ uri: uri, body: sendObject })
}

async function _putAnalysisData (id, sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.putCourseRoundAnalysisDataById.uri, { id: id })
  return client.putAsync({ uri: uri, body: sendObject })
}

async function _deleteAnalysisData (id) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.deleteCourseRoundAnalysisDataById.uri, { id: id })
  return client.delAsync({ uri: uri })
}

async function _getUsedRounds (courseCode, semester) {
  try {
    const paths = api.kursutvecklingApi.paths
    const client = api.kursutvecklingApi.client
    const uri = client.resolve(paths.getUsedRounds.uri, { courseCode: courseCode, semester: semester })
    return await client.getAsync({ uri: uri })
  } catch (error) {
    return error
  }
}

async function _postArchiveFragment (sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.postArchiveFragment.uri)
  return client.postAsync({ uri: uri, body: sendObject })
}

async function _putArchiveFragment (sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.putArchiveFragment.uri)
  return client.putAsync({ uri: uri, body: sendObject })
}
