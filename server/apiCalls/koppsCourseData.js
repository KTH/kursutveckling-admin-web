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

async function _getApplicationCodeFromLadokUId(ladokuid) {
  try {
    const res = await koppsApi.getAsync(`courses/offerings/roundnumber?ladokuid=${ladokuid}`)

    if (res.body) {
      const { application_code } = res.body
      return application_code
    }
    return ''
  } catch (err) {
    return err
  }
}

async function getKoppsCourseData(courseCode, lang = 'sv') {
  try {
    const { body } = await koppsApi.getAsync(`course/${encodeURIComponent(courseCode)}/courseroundterms`)
    if (body) {
      const { termsWithCourseRounds } = body
      for await (const { rounds } of termsWithCourseRounds) {
        for await (const round of rounds) {
          const { ladokUID } = round
          if (ladokUID && ladokUID !== '') {
            const applicationCode = await _getApplicationCodeFromLadokUId(ladokUID)
            round.applicationCode = applicationCode
          } else {
            round.applicationCode = ''
          }
        }
      }
      return termsWithCourseRounds
    }
    return []
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
