'use strict'

const log = require('@kth/log')
const api = require('../api')

module.exports = {
  getStatisicsForRound: _getStatisicsForRound,
}

async function _getStatisicsForRound(roundEndDate, body) {
  try {
    const paths = api.kursstatistikApi.paths
    const client = api.kursstatistikApi.client
    const uri = client.resolve(paths.requestRoundStatisticsByLadokId.uri, { roundEndDate: roundEndDate })
    return await client.postAsync({ uri: uri, body })
  } catch (error) {
    log.error('Error in _getStatisicsForRound', error, '\nroundEndDate', roundEndDate, 'body', body)
    return { body: {} }
  }
}
