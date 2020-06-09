'use strict'

const axios = require('axios')
const { getEnv, devDefaults } = require('kth-node-configuration')
const api = require('../api')

module.exports = {
  getRoundAnalysisData: _getAnalysisData,
  setRoundAnalysisData: _setAnalysisData,
  updateRoundAnalysisData: _putAnalysisData,
  deleteRoundAnalysisData: _deleteAnalysisData,
  getUsedRounds: _getUsedRounds,
  postArchiveFragment: _postArchiveFragment,
  putArchiveFragment: _putArchiveFragment,
  getAllArchiveFragments: _getAllArchiveFragments,
  createArchivePackage: _createArchivePackage,
  setExportedArchiveFragments: _setExportedArchiveFragments
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

async function _getAllArchiveFragments () {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.getAllArchiveFragments.uri)
  return client.getAsync({ uri: uri })
}

async function _createArchivePackage (sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const path = client.resolve(paths.createArchivePackage.uri)
  const { https, host, port } = api.kursutvecklingApi.config
  const url = `${https ? 'https' : 'http'}://${host}${port ? (':' + port) : ''}${path}`
  const response = await axios({
    method: 'post',
    url: url,
    data: sendObject,
    headers: { 'api_key': getEnv('API_KEY', devDefaults('9876')) },
    responseType: 'arraybuffer'
  })
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log(error)
      return {}
    })
  return response
}

async function _setExportedArchiveFragments (sendObject) {
  const paths = api.kursutvecklingApi.paths
  const client = api.kursutvecklingApi.client
  const uri = client.resolve(paths.putExportedArchiveFragments.uri)
  return client.putAsync({ uri: uri, body: sendObject })
}
