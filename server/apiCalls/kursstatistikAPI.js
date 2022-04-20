'use strict'

const log = require('@kth/log')
const api = require('../api')

module.exports = {
  getStatisicsForRound: _getStatisicsForRound,
}

async function _getStatisicsForRound(roundEndDate, body) {
  try {
    const { client, paths } = api.kursstatistikApi
    const uri = client.resolve(paths.requestRoundStatisticsByLadokId.uri, { roundEndDate })
    return await client.postAsync({ uri, body })
  } catch (error) {
    log.error('Error in _getStatisicsForRound', error, '\nroundEndDate', roundEndDate, 'body', body)
    return { body: {} }
  }
}
