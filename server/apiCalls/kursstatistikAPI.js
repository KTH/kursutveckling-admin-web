'use strict'

const api = require('../api')

module.exports = {
  getStatisicsForRound: _getStatisicsForRound
}

async function _getStatisicsForRound (roundEndDate, body) {
  const paths = api.kursstatistikApi.paths

  const client = api.kursstatistikApi.client
  const uri = client.resolve(paths.requestRoundStatisticsByLadokId.uri, { roundEndDate: roundEndDate })
  let test = await client.postAsync({ uri: uri, body })
  return test
}
