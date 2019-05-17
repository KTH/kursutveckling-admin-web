'use strict'

const co = require('co')
const log = require('kth-node-log')
const redis = require('kth-node-redis')
const language = require('kth-node-web-common/lib/language')
const { safeGet } = require('safe-utils')
const { toJS } = require('mobx')
const httpResponse = require('kth-node-response')
const i18n = require('../../i18n')

const api = require('../api')
const { runBlobStorage } = require('../blobStorage')

const kursutvecklingAPI = require('../apiCalls/kursutvecklingAPI')
const koppsCourseData = require('../apiCalls/koppsCourseData')

const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const paths = require('../server').getPaths()

const ReactDOMServer = require('react-dom/server')
// const { StaticRouter } = require('react-router')
let { staticFactory } = require('../../dist/app.js')

module.exports = {
  getIndex: getIndex,
  getRoundAnalysis: co.wrap(_getRoundAnalysis),
  postRoundAnalysis: co.wrap(_postRoundAnalysis),
  deleteRoundAnalysis: co.wrap(_deleteRoundAnalysis),
  getCourseEmployees: co.wrap(_getCourseEmployees),
  getUsedRounds: co.wrap(_getUsedRounds),
  getKoppsCourseData: co.wrap(_getKoppsCourseData),
  saveFileToStorage: co.wrap(_saveFileToStorage)
}

function * _saveFileToStorage (req, res, next) {
  console.log('_saveFileToStorage', req.body, req.files.filepond)
  log.info('_saveFileToStorage', req.body, req.files.filepond)
  // const blobService = storage.createBlobService()
  yield runBlobStorage(req.files.filepond, req.params.id, req.params.type, req.params.published)
  return httpResponse.json(res, req.files.filepond.name)
}

function * _postRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  const isNewAnalysis = req.params.status
  const language = req.params.language || 'sv'
  const sendObject = JSON.parse(req.body.params)

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
    log.error('Exception calling from setRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _getRoundAnalysis (req, res, next) {
  console.log('getRoundAnalysis', req.params.id)
  const roundAnalysisId = req.params.id || ''
  const language = req.params.language || 'sv'
  console.log('getRoundAnalysis', roundAnalysisId)
  try {
    const apiResponse = yield kursutvecklingAPI.getRoundAnalysisData(roundAnalysisId, language)
    /* if (apiResponse.statusCode !== 200) {
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send()
    } */
    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception calling from getRoundAnalysis ', { error: err })
    next(err)
  }
}

function * _deleteRoundAnalysis (req, res, next) {
  const roundAnalysisId = req.params.id
  const apiResponse = yield kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
  return httpResponse.json(res, apiResponse)
}

function * _getKoppsCourseData (req, res, next) {
  const courseCode = req.params.courseCode
  const language = req.params.language || 'sv'

  try {
    const apiResponse = yield koppsCourseData.getKoppsCourseData(courseCode, language)
    /* if (apiResponse.statusCode !== 200) {
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send(courseCode)
    } */

    return httpResponse.json(res, apiResponse.body)
  } catch (err) {
    log.error('Exception calling from koppsAPI ', { error: err })
    next(err)
  }
}

function * _getUsedRounds (req, res, next) {
  const courseCode = req.params.courseCode
  const semester = req.params.semester
  try {
    const apiResponse = yield kursutvecklingAPI.getUsedRounds(courseCode, semester)

    /* if (apiResponse.statusCode !== 200) {
      res.status(apiResponse.statusCode)
      res.statusCode = apiResponse.statusCode
      res.send()
    } */
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception calling from _getUsedRounds ', { error: error })
    next(error)
  }
}

function * _getCourseEmployees (req, res) {
  let key = req.params.key
  key = key.replace(/_/g, '.')
  try {
    const roundsKeys = JSON.parse(req.body.params)

    yield redis('ugRedis', serverConfig.cache.ugRedis.redis)
      .then(function (ugClient) {
        return ugClient.multi()
          .mget(roundsKeys.examiner)
          .mget(roundsKeys.responsibles)
          .execAsync()
      })
      .then(function (returnValue) {
        console.log('ugRedis - multi -VALUE', returnValue)
        return httpResponse.json(res, returnValue)
      })
      .catch(function (err) {
        console.log('ugRedis - error:: ', err)
      })
  } catch (err) {
    log.error('Exception calling from ugRedis - multi', { error: err })
    return err
  }
}

async function getIndex (req, res, next) {
  if (process.env['NODE_ENV'] === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
    const tmp = require('../../dist/app.js')
    staticFactory = tmp.staticFactory
  // doAllAsyncBefore = tmp.doAllAsyncBefore
  }

  let lang = language.getLanguage(res) || 'sv'
  const ldapUser = req.session.authUser ? req.session.authUser.username : 'null'
  const courseTitle = req.query.title || ''

  try {
    const renderProps = staticFactory()
    renderProps.props.children.props.routerStore.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)

    if (req.params.id.length === 6) {
      // New analysis
      const apiResponse = await koppsCourseData.getKoppsCourseData(req.params.id, lang)
      renderProps.props.children.props.routerStore.setCourseCode(req.params.id) // TODO: title
      await renderProps.props.children.props.routerStore.handleCourseData(apiResponse.body, ldapUser, lang)
    } else {
      const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(req.params.id, lang)
      renderProps.props.children.props.routerStore.analysisData = apiResponse.body
      renderProps.props.children.props.routerStore.status = apiResponse.body.isPublished ? 'published' : 'draft'
      renderProps.props.children.props.routerStore.setCourseTitle(courseTitle.length > 0 ? decodeURIComponent(courseTitle) : '')
      // console.log('apiResponse.body', apiResponse.body)
    }

    renderProps.props.children.props.routerStore.__SSR__setCookieHeader(req.headers.cookie)
    // await renderProps.props.children.props.routerStore.getRoundAnalysis(req.params.id)
    renderProps.props.children.props.routerStore.analysisId = req.params.id

    const breadcrumDepartment = await renderProps.props.children.props.routerStore.getBreadcrumbs()
    let breadcrumbs = [
      { url: '', label: i18n.message('page_course_programme', lang) }
    ]
    breadcrumbs.push(breadcrumDepartment)

    // await doAllAsyncBefore({
    // pathname: req.originalUrl,
    // query: (req.originalUrl === undefined || req.originalUrl.indexOf('?') === -1) ? undefined : req.originalUrl.substring(req.originalUrl.indexOf('?'), req.originalUrl.length),
    // routerStore: renderProps.props.children.props.routerStore
    // routes: renderProps.props.children.props.children.props.children.props.children
    // })

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('admin/index', {
      breadcrumbsPath: breadcrumbs,
      debug: 'debug' in req.query,
      html: html,
      title: 'TODO',
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: lang,
      description: 'TODO' // lang === 'sv' ? "KTH  för "+courseCode.toUpperCase() : "KTH course information "+courseCode.toUpperCase()
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
