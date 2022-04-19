'use strict'

const log = require('@kth/log')
const redis = require('kth-node-redis')
const language = require('@kth/kth-node-web-common/lib/language')
const httpResponse = require('@kth/kth-node-response')
const paths = require('../server').getPaths()
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const api = require('../api')
const kursutvecklingAPI = require('../apiCalls/kursutvecklingAPI')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const kursstatistikAPI = require('../apiCalls/kursstatistikAPI')
const i18n = require('../../i18n')
const { runBlobStorage, updateMetaData, deleteBlob } = require('../blobStorage')
const { getSortedAndPrioritizedMiniMemosWebOrPdf } = require('../apiCalls/kursPmDataApi')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

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
    } else {
      apiResponse = await kursutvecklingAPI.updateRoundAnalysisData(roundAnalysisId, sendObject, language)
    }

    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
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
    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
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
    return httpResponse.json(res, apiResponse, apiResponse.statusCode)
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
    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
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
    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
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

async function _updateFileInStorage(req, res, next) {
  log.debug('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
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
    log.error('No connection to ugRedis')
    const error = new Error('No access to  ugRedis - ' + err)
    error.status = 500
    return next(error)
  }

  const lang = language.getLanguage(res) || 'sv'
  //const user = req.user ? req.user.username : 'null'
  const { user: loggedInUser } = req.session.passport
  const username = loggedInUser ? loggedInUser.username : 'null'
  const { memberOf } = loggedInUser
  const { title: courseTitle = '' } = req.query
  let status = req.query.status
  const { id: thisId } = req.params
  const analysisId = thisId.length <= 7 ? '' : thisId.toUpperCase()
  const courseCodeId = analysisId ? analysisId.split('_')[0].slice(0, -6).toUpperCase() : thisId.toUpperCase()

 try {
    const context = {}
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }
    /* ------- Settings ------- */
    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    webContext.setLanguage(lang)
    await webContext.getMemberOf(memberOf, req.params.id.toUpperCase(), username, serverConfig.auth.superuserGroup)
    if (thisId.length <= 7) {
      /** ------- Got course code -> prepare for Page 1 depending on status (draft or published) ------- */
      log.debug(' getIndex, get course data for : ' + courseCodeId)
      const apiResponse = await koppsCourseData.getKoppsCourseData(courseCodeId, lang)
      if (apiResponse.statusCode >= 400) {
        webContext.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        webContext.status = status === 'p' ? 'published' : 'new'
        await webContext.handleCourseData(apiResponse.body, courseCodeId, username, lang)
      }
    } else {
      /** ------- Got analysisId  -> request analysis data from api ------- */
      log.debug(' getIndex, get analysis data for : ' + analysisId)
      const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(analysisId, lang)

      if (apiResponse.statusCode >= 400) {
        webContext.errorMessage = apiResponse.statusMessage // TODO: ERROR?????
      } else {
        webContext.analysisId = analysisId
        webContext.analysisData = apiResponse.body

        const { courseCode } = apiResponse.body
        webContext.courseCode = courseCode

        /** ------- Setting status ------- */
        status = req.params.preview && req.params.preview === 'preview' ? 'preview' : status
        switch (status) {
          case 'p':
            webContext.status = 'published'
            break
          case 'n':
            webContext.status = 'draft'
            break
          default:
            webContext.status = 'draft'
        }
        log.debug(' getIndex, status set to: ' + status)

        /** ------- Creating title  ------- */
        webContext.setCourseTitle(
          courseTitle.length > 0 ? decodeURIComponent(courseTitle) : ''
        )
      }
    }

    // /* Course memo for preview */
    log.debug(' get data from kurs-pm-data-api, get kurs-pm data for : ' + courseCodeId)

    webContext.miniMemosPdfAndWeb = await getSortedAndPrioritizedMiniMemosWebOrPdf(
      courseCodeId
    )
    log.debug(
      'data from kurs-pm-data-api, fetched successfully : ' +
      webContext.miniMemosPdfAndWeb
    )

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath
    
    const html = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('admin/index', {
      compressedData,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: html,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      lang: lang,
      proxyPrefix,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
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
  updateFileInStorage: _updateFileInStorage,
  getStatisicsForRound: _getStatisicsForRound,
}
