'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const serverPaths = require('../server').getPaths()
const ReactDOMServer = require('react-dom/server')
const apis = require('../api')
const paths = require('../server').getPaths()
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const i18n = require('../../i18n')
const {
  createArchivePackage,
  setExportedArchiveFragments,
} = require('../apiCalls/kursutvecklingAPI')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

function _staticRender(context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { appFactory } = require('../../dist/app.js')
  return appFactory(context, location)
}

async function _createArchivePackage(req, res, next) {
  const selected = req.body
  log.debug('createArchivePackage called with:', selected)

  try {
    const apiResponse = await createArchivePackage(selected)
    res.send(apiResponse)
  } catch (err) {
    log.error('Exception from createArchivePackage', { error: err })
    next(err)
  }
}

async function _setExportedArchiveFragments(req, res, next) {
  const selected = req.body
  log.debug('setExportedArchiveFragments called with:', selected)

  try {
    const apiResponse = await setExportedArchiveFragments(selected)
    res.send(apiResponse)
  } catch (err) {
    log.error('Exception from setExportedArchiveFragments', { error: err })
    next(err)
  }
}

async function getIndex(req, res, next) {
  try {
    const context = {}
    const lang = language.getLanguage(res) || 'sv'
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }

    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    webContext.setLanguage(lang)

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath
    
    const html = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    res.render('archive/index', {
      compressedData,
      debug: 'debug' in req.query,
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
  getIndex: getIndex,
  createArchivePackage: _createArchivePackage,
  setExportedArchiveFragments: _setExportedArchiveFragments,
}
