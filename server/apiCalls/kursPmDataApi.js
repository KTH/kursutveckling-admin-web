'use strict'

const log = require('kth-node-log')

const i18n = require('../../i18n')
const api = require('../api')

async function getSortedAndPrioritizedMiniMemosWebOrPdf(courseCode) {
  const { client, paths } = api.kursPmDataApi
  const uri = client.resolve(paths.getPrioritizedWebOrPdfMemosByCourseCode.uri, { courseCode })
  log.debug('Fetching data from kurs-pm-data-api', { uri })

  try {
    const { body } = await client.getAsync({ uri })

    return body || []
  } catch (err) {
    log.debug('getSortedAndPrioritizedMiniMemosWebOrPdf is not available', err)
    return err
  }
}

module.exports = {
  getSortedAndPrioritizedMiniMemosWebOrPdf,
}
