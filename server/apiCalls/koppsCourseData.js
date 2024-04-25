'use strict'

const { BasicAPI } = require('@kth/api-call')
const { server: config } = require('../configuration')

const koppsApi = new BasicAPI({
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: config.koppsApi.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: 10000, // config.koppsApi.defaultTimeout detailedinformation?l=${language}
})

async function _getDetailedInformation(courseCode, language = 'sv') {
  try {
    return await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/detailedinformation?l=${language}`)
  } catch (err) {
    return err
  }
}

async function getKoppsCourseData(courseCode) {
  try {
    return await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/courseroundterms`)
  } catch (err) {
    return err
  }
}

async function getDetailedKoppsCourseRounds(courseCode, language = 'sv') {
  try {
    const detailedInformation = await _getDetailedInformation(courseCode, language)
    const { body } = detailedInformation
    const { roundInfos } = body
    const courseRounds = roundInfos.map(r => r.round)
    return courseRounds
  } catch (err) {
    return err
  }
}

async function getCourseSchool(courseCode) {
  try {
    const { body: course, statusCode } = await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}`)
    if (!course || statusCode !== 200) return 'kopps_get_fails'

    const { school } = course
    if (!school) return 'missing_school_code'
    const { code } = school
    if (!code) return 'missing_school_code'
    return code
  } catch (err) {
    return err
  }
}

module.exports = {
  getCourseSchool,
  getKoppsCourseData,
  getDetailedKoppsCourseRounds,
}
