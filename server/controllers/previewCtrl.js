'use strict'

const api = require('../api')
const co = require('co')
const log = require('kth-node-log')
const { safeGet } = require('safe-utils')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

module.exports = {
  getIndex: getIndex
}

async function getIndex (req, res, next) {
  const lang = req.query.lang || 'sv'

  try {
    // const client = api.kursplanApi.client
   // const paths = api.kursplanApi.paths

    // const resp = await client.getAsync(client.resolve(paths.getSyllabusByCourseCode.uri, { courseCode: courseCode, semester: semester, language:lang }), { useCache: true })

  } catch (err) {
    log.error('Error in formCtrl/getIndex', { error: err })
    next(err)
  }
}

