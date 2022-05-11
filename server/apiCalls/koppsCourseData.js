'use strict'

const { BasicAPI } = require('@kth/api-call')
const { server: config } = require('../configuration')

const koppsApi = new BasicAPI({
  hostname: config.koppsApi.host,
  basePath: config.koppsApi.basePath,
  https: config.koppsApi.https,
  json: true,
  // Kopps is a public API and needs no API-key
  defaultTimeout: 10000, // config.koppsApi.defaultTimeout
})

async function getKoppsCourseData(courseCode, lang = 'sv') {
  try {
    return await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/courseroundterms`)
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
}
