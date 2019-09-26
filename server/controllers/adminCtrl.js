'use strict'

const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')
const paths = require('../server').getPaths()
const ReactDOMServer = require('react-dom/server')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server

const api = require('../api')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage')
const kursutvecklingAPI = require('../apiCalls/kursutvecklingAPI')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const kursstatistikAPI = require('../apiCalls/kursstatistikAPI')
const i18n = require('../../i18n')

function _staticFactory (context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { staticFactory } = require('../../dist/app.js')
  return staticFactory(context, location)
}
module.exports = {
  getIndex: getIndex,
  getRoundAnalysis: co.wrap(_getRoundAnalysis),
  postRoundAnalysis: co.wrap(_postRoundAnalysis),
  deleteRoundAnalysis: co.wrap(_deleteRoundAnalysis),
  getCourseEmployees: co.wrap(_getCourseEmployees),
  getUsedRounds: co.wrap(_getUsedRounds),
  getKoppsCourseData: co.wrap(_getKoppsCourseData),
  saveFileToStorage: co.wrap(_saveFileToStorage),
  updateFileInStorage: co.wrap(_updateFileInStorage),
  deleteFileInStorage: co.wrap(_deleteFileInStorage),
  getStatisicsForRound: co.wrap(_getStatisicsForRound)
}

// ------- ANALYSES FROM KURSUTVECKLING-API: POST, GET, DELETE, GET USED ROUNDS ------- /

function * _postRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  const isNewAnalysis = req.params.status
  const language = req.params.language || 'sv'
  const sendObject = JSON.parse(req.body.params)
  log.debug('_postRoundAnalysis id:' + req.params.id)
  try {
    let apiResponse = {}
    if (isNewAnalysis === 'true') {
      apiResponse = yield kursutvecklingAPI.setRoundAnalysisData(roundAnalysisId, sendObject, language)
    } else {
      apiResponse = yield kursutvecklingAPI.updateRoundAnalysisData(roundAnalysisId, sendObject, language)
    }

    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from setRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _getRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id || ''
  const language = req.params.language || 'sv'
  log.info('_getRoundAnalysis id:' + req.params.id)
  try {
    const apiResponse = yield kursutvecklingAPI.getRoundAnalysisData(roundAnalysisId, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from getRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _deleteRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  log.info('_deleteRoundAnalysis with id:' + req.params.id)
  try {
    const apiResponse = yield kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
    return httpResponse.json(res, apiResponse)
  } catch (err) {
    log.error('Exception from _deleteRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _getUsedRounds (req, res, next) {
  const courseCode = req.params.courseCode
  const semester = req.params.semester
  log.debug('_getUsedRounds with course code: ' + courseCode + 'and semester: ' + semester)
  try {
    const apiResponse = yield kursutvecklingAPI.getUsedRounds(courseCode, semester)
    log.debug('_getUsedRounds response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

// ------- COURSE DATA FROM KOPPS-API   ------- /
function * _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'
  log.info('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = yield koppsCourseData.getKoppsCourseData(courseCode, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
function * _saveFileToStorage (req, res, next) {
  log.info('Saving uploaded file to storage ' + req.files.file)
  let file = req.files.file
  try {
    const fileName = yield runBlobStorage(file, req.params.analysisid, req.params.type, req.params.published, req.body)
    return httpResponse.json(res, fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error: error })
    next(error)
  }
}

function * _updateFileInStorage (req, res, next) {
  log.info('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = yield updateMetaData(req.params.fileName, req.body.params.metadata)
    return httpResponse.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error: error })
    next(error)
  }
}

function * _deleteFileInStorage (res, req, next) {
  log.debug('_deleteFileInStorage, id:' + req.req.params.id)
  try {
    const response = yield deleteBlob(req.req.params.id)
    log.debug('_deleteFileInStorage, id:', response)
    return httpResponse.json(res.res)
  } catch (error) {
    log.error('Exception from _deleteFileInStorage ', { error: error })
    next(error)
  }
}

// ------- EXAMINATOR AND RESPONSIBLES FROM UG-REDIS: ------- /
function * _getCourseEmployees (req, res, next) {
  let key = req.params.key
  key = key.replace(/_/g, '.')

  try {
    const roundsKeys = JSON.parse(req.body.params)
    log.info('_getCourseEmployees with keys: ' + roundsKeys.examiner, roundsKeys.responsibles)
    yield redis('ugRedis', serverConfig.cache.ugRedis.redis)
      .then(function (ugClient) {
        return ugClient.multi()
          .mget(roundsKeys.examiner)
          .mget(roundsKeys.responsibles)
          .execAsync()
      })
      .then(function (returnValue) {
        log.debug('ugRedis - return:', returnValue)
        return httpResponse.json(res, returnValue)
      })
      .catch(function (err) {
        console.log('ugRedis - error:: ', err)
        throw new Error(err)
      })
  } catch (err) {
    log.error('Exception from ugRedis - multi', { error: err })
    return next(err)
  }
}

function * _getStatisicsForRound (req, res, next) {
  console.log(req.params)
  log.debug('_getStatisicsForRound : ', req.body.params, req.params.roundEndDate)
  // Solution for rounds that missing ladokUID in kopps
  if (req.body.params.length === 0) {
    let reponseObject = { registeredStudents: -1, examinationGrade: -1 }
    return httpResponse.json(res, reponseObject, 200)
  }
  try {
    const apiResponse = yield kursstatistikAPI.getStatisicsForRound(req.params.roundEndDate, req.body.params)
    log.debug('_getStatisicsForRound response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

async function getIndex (req, res, next) {
  /** ------- CHECK OF CONNECTION TO API AND UG_REDIS ------- */
  if (api.kursutvecklingApi.connected === false) {
    log.error('No connection to kursutveckling-api', api.kursutvecklingApi)
    const error = new Error('API - ERR_CONNECTION_REFUSED')
    error.status = 500
    return next(error)
  }
  try {
    await redis('ugRedis', serverConfig.cache.ugRedis.redis)
  } catch (err) {
    log.error('No connection to kursutveckling-api', api.kursutvecklingApi)
    const error = new Error('No access to  ugRedis - ' + err)
    error.status = 500
    return next(error)
  }

  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  const courseTitle = req.query.title || ''
  let status = req.query.status
  const service = req.query.serv

  try {
    const renderProps = _staticFactory()
    /* ------- Settings ------- */
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl, service)
    renderProps.props.children.props.routerStore.setLanguage(lang)
    renderProps.props.children.props.routerStore.setService(service)
    await renderProps.props.children.props.routerStore.getMemberOf(req.session.authUser.memberOf, req.params.id.toUpperCase(), req.session.authUser.username, serverConfig.auth.superuserGroup)
    if (req.params.id.length <= 7) {
    /** ------- Got course code -> prepare for Page 1 depending on status (draft or published) ------- */
      log.debug(' getIndex, get course data for : ' + req.params.id)
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        renderProps.props.children.props.routerStore.status = status === 'p' ? 'published' : 'new'
        await renderProps.props.children.props.routerStore.handleCourseData(apiResponse.body, req.params.id.toUpperCase(), ldapUser, lang)
      }
    } else {
      /** ------- Got analysisId  -> request analysis data from api ------- */
      log.debug(' getIndex, get analysis data for : ' + req.params.id)
      const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        renderProps.props.children.props.routerStore.analysisId = req.params.id
        renderProps.props.children.props.routerStore.analysisData = apiResponse.body

        /** ------- Setting status ------- */
        status = req.params.preview && req.params.preview === 'preview' ? 'preview' : status
        switch (status) {
          case 'p' : renderProps.props.children.props.routerStore.status = 'published'
            break
          case 'n' : renderProps.props.children.props.routerStore.status = 'draft'
            break
          default : renderProps.props.children.props.routerStore.status = 'draft'
        }
        log.debug(' getIndex, status set to: ' + status)

        /** ------- Creating title  ------- */
        renderProps.props.children.props.routerStore.setCourseTitle(courseTitle.length > 0 ? decodeURIComponent(courseTitle) : '')
      }
    }
    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('admin/index', {
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: lang,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

function hydrateStores (renderProps) {
  // This assumes that all stores are specified in a root element called Provider
  const props = renderProps.props.children.props
  const outp = {}
  for (let key in props) {
    if (typeof props[key].initializeStore === 'function') {
      outp[key] = encodeURIComponent(JSON.stringify(toJS(props[key], true)))
    }
  }
  return outp
}
