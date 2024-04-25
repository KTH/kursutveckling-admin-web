'use strict'

const api = require('../api')

async function _getAnalysisData(id) {
  const { client, paths } = api.kursutvecklingApi
  const uri = client.resolve(paths.getCourseRoundAnalysisDataById.uri, { id })
  return client.getAsync({ uri })
}

async function _setAnalysisData(id, sendObject) {
  const { client, paths } = api.kursutvecklingApi

  const uri = client.resolve(paths.postCourseRoundAnalysisDataById.uri, { id })
  return client.postAsync({ uri, body: sendObject })
}

async function _putAnalysisData(id, sendObject) {
  const { client, paths } = api.kursutvecklingApi

  const uri = client.resolve(paths.putCourseRoundAnalysisDataById.uri, { id })
  return client.putAsync({ uri, body: sendObject })
}

async function _deleteAnalysisData(id) {
  const { client, paths } = api.kursutvecklingApi

  const uri = client.resolve(paths.deleteCourseRoundAnalysisDataById.uri, { id })
  return client.delAsync({ uri })
}

async function _getUsedRounds(courseCode, semester) {
  try {
    const { client, paths } = api.kursutvecklingApi

    const uri = client.resolve(paths.getUsedRounds.uri, { courseCode, semester })
    return await client.getAsync({ uri })
  } catch (error) {
    return error
  }
}

module.exports = {
  getRoundAnalysisData: _getAnalysisData,
  setRoundAnalysisData: _setAnalysisData,
  updateRoundAnalysisData: _putAnalysisData,
  deleteRoundAnalysisData: _deleteAnalysisData,
  getUsedRounds: _getUsedRounds,
}
