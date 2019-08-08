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
const i18n = require('../../i18n')

let { staticFactory } = require('../../dist/app.js')

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
  deleteFileInStorage: co.wrap(_deleteFileInStorage)
}

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

    /* if (apiResponse.statusCode !== 200) { // TODO: Handle with alert
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send()
    } */

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
    /* if (apiResponse.statusCode !== 200) {
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send()
    } */
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from getRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _deleteRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  log.info('_deleteRoundAnalysis with id:' + req.params.id)
  const apiResponse = yield kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
  return httpResponse.json(res, apiResponse)
}

function * _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'
  log.info('_getKoppsCourseData with code:' + courseCode)
  try {
    const apiResponse = yield koppsCourseData.getKoppsCourseData(courseCode, language)
    /* if (apiResponse.statusCode !== 200) {
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send(courseCode)
    } */

    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
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
    if (apiResponse.message) {
      throw new Error(apiResponse.message)
    }
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error: error })
    next(error)
  }
}

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
      })
  } catch (err) {
    log.error('Exception from ugRedis - multi', { error: err })
    return next(err)
  }
}

async function getIndex (req, res, next) {
  if (api.kursutvecklingApi.connected === false) {
    log.error('No connection to kursutveckling-api', api.kursutvecklingApi)
    const error = new Error('API - ERR_CONNECTION_REFUSED')
    error.status = 500
    return next(error)
  }

  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
    const tmp = require('../../dist/app.js')
    staticFactory = tmp.staticFactory
  }

  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  const courseTitle = req.query.title || ''
  let status = req.query.status
  const service = req.query.serv

  // console.log('!!!!!!', req)

  try {
    const renderProps = staticFactory()
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl, service)
    renderProps.props.children.props.routerStore.setLanguage(lang)
    renderProps.props.children.props.routerStore.setService(service)
    await renderProps.props.children.props.routerStore.getMemberOf(req.session.authUser.memberOf, req.params.id.toUpperCase(), req.session.authUser.username)
    if (req.params.id.length <= 7) {
      // Just course code -> analysis menu depending on status
      log.debug(' getIndex, get course data for : ' + req.params.id)
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage
      } else {
        renderProps.props.children.props.routerStore.status = status === 'p' ? 'published' : 'new'
        await renderProps.props.children.props.routerStore.handleCourseData(apiResponse.body, req.params.id.toUpperCase(), ldapUser, lang)
      }
    } else {
      log.debug(' getIndex, get analysis data for : ' + req.params.id)
      const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(req.params.id.toUpperCase(), lang)
      if (apiResponse.statusCode >= 400) {
        renderProps.props.children.props.routerStore.errorMessage = apiResponse.statusMessage
      } else {
        renderProps.props.children.props.routerStore.analysisId = req.params.id
        renderProps.props.children.props.routerStore.analysisData = apiResponse.body

        status = req.params.preview && req.params.preview === 'preview' ? 'preview' : status
        switch (status) {
          case 'p' : renderProps.props.children.props.routerStore.status = 'published'
            break
          case 'n' : renderProps.props.children.props.routerStore.status = 'draft'
            break
          case 'preview' : renderProps.props.children.props.routerStore.status = 'preview'
            break
          default : renderProps.props.children.props.routerStore.status = 'draft'
        }
        log.debug(' getIndex, has status : ' + status)
        renderProps.props.children.props.routerStore.setCourseTitle(courseTitle.length > 0 ? decodeURIComponent(courseTitle) : '')
        if (apiResponse.body.message) {
          renderProps.props.children.props.routerStore.errorMessage = apiResponse.body.message
        }
      }
    }
    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)

    const breadcrumDepartment = await renderProps.props.children.props.routerStore.getBreadcrumbs()
    let breadcrumbs = [
      { url: '', label: i18n.message('page_course_programme', lang) }
    ]
    breadcrumbs.push(breadcrumDepartment)

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('admin/index', {
      breadcrumbsPath: breadcrumbs,
      debug: 'debug' in req.query,
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
