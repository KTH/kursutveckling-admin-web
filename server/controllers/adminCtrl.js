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

function _staticFactory(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { staticFactory } = require('../../dist/app.js')
  return staticFactory(context, location)
}

function _formatSemesterArchive(semester) {
  return `${semester.toString().match(/.{1,4}/g)[1] === '1' ? 'VT' : 'HT'}${semester.toString().match(/.{1,4}/g)[0]}`
}

// ------- ANALYSES FROM KURSUTVECKLING-API: POST, GET, DELETE, GET USED ROUNDS ------- /

async function _postRoundAnalysis(req, res, next) {
  const roundAnalysisId = req.params.id
  const isNewAnalysis = req.params.status
  const language = req.params.language || 'sv'
  const sendObject = JSON.parse(req.body.params)
  log.debug('_postRoundAnalysis id:' + req.params.id)
  try {
    let apiResponse = {}
    if (isNewAnalysis === 'true') {
      apiResponse = await kursutvecklingAPI.setRoundAnalysisData(roundAnalysisId, sendObject, language)
      if (sendObject.isPublished) {
        await _postArchiveFragment(sendObject)
      }
    } else {
      apiResponse = await kursutvecklingAPI.updateRoundAnalysisData(roundAnalysisId, sendObject, language)
      if (sendObject.isPublished) {
        await _putArchiveFragment(sendObject)
      }
    }

    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from setRoundAnalysis ', { error: err })
    next(err)
  }
}

async function _getRoundAnalysis(req, res, next) {
  const roundAnalysisId = req.params.id || ''
  const language = req.params.language || 'sv'
  log.debug('_getRoundAnalysis id:' + req.params.id)
  try {
    const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(roundAnalysisId, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from getRoundAnalysis ', { error: err })
    next(err)
  }
}

async function _deleteRoundAnalysis(req, res, next) {
  const roundAnalysisId = req.params.id
  log.debug('_deleteRoundAnalysis with id:' + req.params.id)
  try {
    const apiResponse = await kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
    return httpResponse.json(res, apiResponse)
  } catch (err) {
    log.error('Exception from _deleteRoundAnalysis ', { error: err })
    next(err)
  }
}

async function _getUsedRounds(req, res, next) {
  const courseCode = req.params.courseCode
  const semester = req.params.semester
  log.debug('_getUsedRounds with course code: ' + courseCode + 'and semester: ' + semester)
  try {
    const apiResponse = await kursutvecklingAPI.getUsedRounds(courseCode, semester)
    log.debug('_getUsedRounds response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

// ------- COURSE DATA FROM KOPPS-API   ------- /
async function _getKoppsCourseData(req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'
  log.debug('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = await koppsCourseData.getKoppsCourseData(courseCode, language)
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
    next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
async function _saveFileToStorage(req, res, next) {
  log.debug('Saving uploaded file to storage ' + req.files.file)
  let file = req.files.file
  try {
    const fileName = await runBlobStorage(file, req.params.analysisid, req.params.type, req.params.published, req.body)
    return httpResponse.json(res, fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error: error })
    next(error)
  }
}

async function updateFileInStorage(req, res, next) {
  log.debug('updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = await updateMetaData(req.params.fileName, req.body.params.metadata)
    return httpResponse.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error })
    next(error)
  }
}

// ------- EXAMINATOR AND RESPONSIBLES FROM UG-REDIS: ------- /
async function _getCourseEmployees(req, res, next) {
  let key = req.params.key
  key = key.replace(/_/g, '.')

  try {
    const roundsKeys = JSON.parse(req.body.params)
    log.debug('_getCourseEmployees with keys: ' + roundsKeys.examiner, roundsKeys.responsibles)
    await redis('ugRedis', serverConfig.cache.ugRedis.redis)
      .then(function (ugClient) {
        return ugClient.multi().mget(roundsKeys.examiner).mget(roundsKeys.responsibles).execAsync()
      })
      .then(function (returnValue) {
        log.debug('ugRedis - return:', returnValue)
        return httpResponse.json(res, returnValue)
      })
      .catch(function (err) {
        throw new Error(err)
      })
  } catch (err) {
    log.error('Exception from ugRedis - multi', { error: err })
    return next(err)
  }
}

async function _getStatisicsForRound(req, res, next) {
  log.debug('_getStatisicsForRound : ', req.body.params, req.params.roundEndDate)
  // Solution for rounds that missing ladokUID in kopps
  if (req.body.params.length === 0) {
    let reponseObject = { registeredStudents: -1, examinationGrade: -1 }
    return httpResponse.json(res, reponseObject, 200)
  }
  try {
    const apiResponse = await kursstatistikAPI.getStatisicsForRound(req.params.roundEndDate, req.body.params)
    log.debug('_getStatisicsForRound response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

async function _postArchiveFragment(sendObject) {
  const archiveFragment = {
    courseCode: sendObject.courseCode,
    courseName: sendObject.courseName,
    courseRound: sendObject._id,
    semester: _formatSemesterArchive(sendObject.semester),
    analysisName: sendObject.analysisName,
    responsibles: sendObject.responsibles,
    examiners: sendObject.examiners,
    description: 'Kursanalys',
    publishedDate: sendObject.publishedDate,
    preserve: 1,
    attachments: [
      {
        fileName: sendObject.analysisFileName,
        remarks: 'Förändringar från föregående kursomgång: ' + sendObject.alterationText,
        fileDate: sendObject.pdfAnalysisDate,
        publishedDate: sendObject.publishedDate,
      },
    ],
  }

  try {
    log.debug('postArchiveFragment called with', archiveFragment)
    const apiResponse = await kursutvecklingAPI.postArchiveFragment(archiveFragment)
    log.debug('postArchiveFragment response code from API', apiResponse.statusCode)
    return apiResponse.statusCode
  } catch (err) {
    log.error('Exception from postArchiveFragment', err)
  }
}

async function _putArchiveFragment(sendObject) {
  const archiveFragment = {
    courseCode: sendObject.courseCode,
    courseName: sendObject.courseName,
    courseRound: sendObject._id,
    semester: _formatSemesterArchive(sendObject.semester),
    analysisName: sendObject.analysisName,
    responsibles: sendObject.responsibles,
    examiners: sendObject.examiners,
    description: 'Kursanalys',
    publishedDate: sendObject.publishedDate,
    preserve: 1,
    attachments: [
      {
        fileName: sendObject.analysisFileName,
        remarks: 'Förändringar från föregående kursomgång: ' + sendObject.alterationText,
        fileDate: sendObject.pdfAnalysisDate,
        publishedDate: sendObject.changedAfterPublishedDate || sendObject.publishedDate,
      },
    ],
  }

  try {
    log.debug('putArchiveFragment called with', archiveFragment)
    const apiResponse = await kursutvecklingAPI.putArchiveFragment(archiveFragment)
    log.debug('putArchiveFragment response code from API', apiResponse.statusCode)
    return apiResponse.statusCode
  } catch (err) {
    log.error('Exception from putArchiveFragment', err)
  }
}

async function getIndex(req, res, next) {
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
    await renderProps.props.children.props.routerStore.getMemberOf(
      req.session.authUser.memberOf,
      req.params.id.toUpperCase(),
      req.session.authUser.username,
      serverConfig.auth.superuserGroup
    )
    if (req.params.id.length <= 7) {
      /** ------- Got course code -> prepare for Page 1 depending on status (draft or published) ------- */
      log.debug(' getIndex, get course data for : ' + req.params.id)
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        renderProps.props.children.props.routerStore.status = status === 'p' ? 'published' : 'new'
        await renderProps.props.children.props.routerStore.handleCourseData(
          apiResponse.body,
          req.params.id.toUpperCase(),
          ldapUser,
          lang
        )
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
          case 'p':
            renderProps.props.children.props.routerStore.status = 'published'
            break
          case 'n':
            renderProps.props.children.props.routerStore.status = 'draft'
            break
          default:
            renderProps.props.children.props.routerStore.status = 'draft'
        }
        log.debug(' getIndex, status set to: ' + status)

        /** ------- Creating title  ------- */
        renderProps.props.children.props.routerStore.setCourseTitle(
          courseTitle.length > 0 ? decodeURIComponent(courseTitle) : ''
        )
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
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

function hydrateStores(renderProps) {
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

module.exports = {
  getIndex,
  getRoundAnalysis: _getRoundAnalysis,
  postRoundAnalysis: _postRoundAnalysis,
  deleteRoundAnalysis: _deleteRoundAnalysis,
  getCourseEmployees: _getCourseEmployees,
  getUsedRounds: _getUsedRounds,
  getKoppsCourseData: _getKoppsCourseData,
  saveFileToStorage: _saveFileToStorage,
  updateFileInStorage,
  getStatisicsForRound: _getStatisicsForRound,
}
