'use strict'
const handlebars = require('handlebars')
const registerHeaderContentHelper = require('@kth/kth-node-web-common/lib/handlebars/helpers/headerContent')
const log = require('@kth/log')
const Handlebars = require('handlebars')
const config = require('../../configuration').server
const packageFile = require('../../../package.json')
const i18n = require('../../../i18n')

let { version } = packageFile

try {
  const buildVersion = require('../../../config/version')
  version = version + '-' + buildVersion.jenkinsBuild
} catch (err) {
  log.error(err.message)
}

/*
  Register standard helpers:

    - withVersion
    - extend
    - prefixScript
    - prefixStyle
    - render

*/
registerHeaderContentHelper({
  proxyPrefixPath: config.proxyPrefixPath.uri,
  version,
})

/**
 * Add any application specific helpers here, you can find some
 * packaged helpers in https://github.com/KTH/kth-node-web-common/tree/master/lib/handlebars/helpers
 * Those only need to be required. Docs embedded in source.
 */
require('@kth/kth-node-web-common/lib/handlebars/helpers/contentedit')

/* Custom languageLinkWithQuery helper instead of the one from kth-node-web-common
 * This custom helper supports keeping query params in the lang link which is needed
 * in kursutveckling-admin-web as query param is used to decide if route is for editing
 * or create new.
 */
Handlebars.registerHelper('languageLinkWithQuery', (lang, query) => {
  const anchorMessageKey = lang === 'sv' ? 'language_link_lang_en' : 'language_link_lang_sv'
  const label = i18n.message(anchorMessageKey, lang)
  const hreflang = lang === 'sv' ? 'sv-SE' : 'en-US'

  const searchParams = new URLSearchParams(query)
  searchParams.set('l', lang === 'sv' ? 'en' : 'sv')
  const link = `?${searchParams.toString()}`

  return `<a class="kth-menu-item language" hreflang="${hreflang}" href="${link}">${label}</a>`
})

require('@kth/kth-node-web-common/lib/handlebars/helpers/createI18nHelper')(i18n)
require('@kth/kth-node-web-common/lib/handlebars/helpers/safe')

handlebars.registerHelper('eq', (var1, var2) => var1.toString() === var2.toString())
