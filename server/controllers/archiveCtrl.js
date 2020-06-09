'use strict'

const log = require('kth-node-log')
const language = require('kth-node-web-common/lib/language')
const { toJS } = require('mobx')
const serverPaths = require('../server').getPaths()
const ReactDOMServer = require('react-dom/server')

const apis = require('../api')
const { browser, server } = require('../configuration')

const i18n = require('../../i18n')

const { getAllArchiveFragments, createArchivePackage, setExportedArchiveFragments } = require('../apiCalls/kursutvecklingAPI')

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

function _staticRender (context, location) {
  if (process.env.NODE_ENV === 'development') {
    delete require.cache[require.resolve('../../dist/app.js')]
  }
  const { staticFactory } = require('../../dist/app.js')
  return staticFactory(context, location)
}

async function _createArchivePackage (req, res, next) {
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

async function _setExportedArchiveFragments (req, res, next) {
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

async function getIndex (req, res, next) {
  try {
    const context = {}
    const renderProps = _staticRender(context, req.url)

    const responseLanguage = language.getLanguage(res) || 'sv'

    const { archiveStore } = renderProps.props.children.props

    archiveStore.setBrowserConfig(browser, serverPaths, apis, server.hostUrl)
    archiveStore.__SSR__setCookieHeader(req.headers.cookie)

    const archiveFragments = await getAllArchiveFragments()
    archiveStore.archiveFragments = archiveFragments.body

    const html = ReactDOMServer.renderToString(renderProps)

    res.render('archive/index', {
      html: html,
      title: i18n.messages[responseLanguage === 'en' ? 0 : 1].messages.title,
      initialState: JSON.stringify(hydrateStores(renderProps)),
      lang: responseLanguage,
      description: i18n.messages[responseLanguage === 'en' ? 0 : 1].messages.title
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    next(err)
  }
}

module.exports = {
  getIndex: getIndex,
  createArchivePackage: _createArchivePackage,
  setExportedArchiveFragments: _setExportedArchiveFragments
}
