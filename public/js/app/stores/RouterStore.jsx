 'use strict'
 import { observable, action } from 'mobx'
 import axios from 'axios'
 import { safeGet } from 'safe-utils'
 import { EMPTY, PROGRAMME_URL, MAX_1_MONTH, MAX_2_MONTH, COURSE_IMG_URL } from '../util/constants'
 import i18n from '../../../../i18n'
 const paramRegex = /\/(:[^\/\s]*)/g

 function _paramReplace (path, params) {
   let tmpPath = path
   const tmpArray = tmpPath.match(paramRegex)
   tmpArray && tmpArray.forEach(element => {
     tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
   })
   return tmpPath
 }

 function _webUsesSSL (url) {
   return url.startsWith('https:')
 }

 class RouterStore {

   @observable roundData = undefined

   buildApiUrl (path, params) {
     let host
     if (typeof window !== 'undefined') {
       host = this.apiHost
     } else {
       host = 'http://localhost:' + this.browserConfig.port
     }
     if (host[host.length - 1] === '/') {
       host = host.slice(0, host.length - 1)
     }
     const newPath = params ? _paramReplace(path, params) : path
     return [host, newPath].join('')
   }

   _getOptions (params) { console.log('_getOptions', this.cookieHeader)

    // Pass Cookie header on SSR-calls
     let options
     if (typeof window === 'undefined') {
       options = {
         headers: {
           Cookie: this.cookieHeader,
           Accept: 'application/json',
           'X-Forwarded-Proto': (_webUsesSSL(this.apiHost) ? 'https' : 'http')
         },
         timeout: 10000,
         params: params
       }
     } else {
       options = {
         params: params
       }
     }
     return options
   }

/** ***************************************************************************************************************************************** */
/*                                                       COLLECTED ROUND INFORMATION                                                        */
/** ***************************************************************************************************************************************** */
   @action getRoundAnalysis (id, lang) { console.log(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri, { id:id/*, lang: lang*/}), this._getOptions())
     return axios.get(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri, { id:id/*, lang: lang*/}), this._getOptions()).then(result => {
       console.log(result.data)
       this.roundData = result.data
     }).catch(err => {
       if (err.response) {
         throw new Error(err.message)
       }
       throw err
     })
   }

   @action postRoundAnalysisData (postObject) {
     return axios.post(this.buildApiUrl(this.paths.api.kursutvecklingPost.uri,
                      { id:postObject.id/*, lang: lang*/}),
                      this._getOptions(JSON.stringify(postObject))
    ).then(result => {
      console.log(result.data)
      return result.data
    }).catch(err => {
        if (err.response) {
          throw new Error(err.message)
        }
        throw err
      })
   }

/** ***************************************************************************************************************************************** */
/*                                            UG REDIS - examiners, teachers and responsibles                                                */
/** ***************************************************************************************************************************************** */
   @action getCourseEmployeesPost (key, type = 'multi', lang = 'sv') {

     if (this.courseData.courseRoundList.length === 0) return ''

     return axios.post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key:key, type:type }), this._getOptions(JSON.stringify(this.keyList))).then(result => {
       const returnValue = result.data
       const emptyString = EMPTY[this.activeLanguage]
       let roundList = this.courseData.roundList
       let roundId = 0
       const thisStore = this
       Object.keys(roundList).forEach(function (key) {
         let rounds = roundList[key]
         for (let index = 0; index < rounds.length; index++) {
           rounds[index].round_teacher = returnValue[0][roundId] !== null ? thisStore.createPersonHtml(JSON.parse(returnValue[0][roundId]), 'teacher') : emptyString
           rounds[index].round_responsibles = returnValue[1][roundId] !== null ? thisStore.createPersonHtml(JSON.parse(returnValue[1][roundId]), 'responsible') : emptyString
           roundId++
         }
         thisStore.courseData.roundList[key] = rounds
       })
      // TODO: DELETE
       let rounds2 = this.courseData.courseRoundList
       for (let index = 0; index < returnValue[0].length; index++) {
         rounds2[index].round_teacher = returnValue[0][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[0][index]), 'teacher') : emptyString
         rounds2[index].round_responsibles = returnValue[1][index] !== null ? this.createPersonHtml(JSON.parse(returnValue[1][index]), 'responsible') : emptyString
       }

       this.courseData.courseRoundList = rounds2
     }).catch(err => {
       if (err.response) {
         throw new Error(err.message, err.response.data)
       }
       throw err
     })
   }

  /* @action getCourseEmployees (key, type = 'examinator', lang = 0) {
     return axios.get(this.buildApiUrl(this.paths.redis.ugCache.uri, { key:key, type:type })).then(result => {
       this.courseData.courseInfo.course_examiners = result.data && result.data.length > 0 ? this.createPersonHtml(result.data, 'examiner') : EMPTY[this.activeLanguage]
     }).catch(err => {
       if (err.response) {
         throw new Error(err.message, err.response.data)
       }
       throw err
     })
   }

   isValidData (dataObject, language = 0) {
     return !dataObject ? EMPTY[language] : dataObject
   }*/

   createPersonHtml (personList, type) {
     let personString = ''
     personList.forEach(person => {
       personString += `<p class = "person">
          <i class="fas fa-user-alt"></i>
            <a href="/profile/${person.username}/" target="_blank" property="teach:teacher">
              ${person.givenName} ${person.lastName} 
            </a> 
          </p>  `
          // <i class="far fa-envelope"></i>&nbsp;${person.email}
      //* * Check if the logged in user is examinator or responsible and can edit course page **/
       if (this.user === person.username && (type === 'responsible' || type === 'examiner')) // TODO:
         this.canEdit = true
     })
     return personString
   }
/** ***********************************************************************************************************************/

   @action getLdapUserByUsername (params) {
     return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions()).then((res) => {
       return res.data
     }).catch(err => {
       if (err.response) {
         throw new Error(err.message, err.response.data)
       }
       throw err
     })
   }

   @action getBreadcrumbs () {
     return {
       url:'/admin/kursutveckling/',
       label:'TODO'
     }
   }

   @action setBrowserConfig (config, paths, apiHost, profileBaseUrl) {
     this.browserConfig = config
     this.paths = paths
     this.apiHost = apiHost
     this.profileBaseUrl = profileBaseUrl
   }

   @action __SSR__setCookieHeader (cookieHeader) {
     if (typeof window === 'undefined') {
       this.cookieHeader = cookieHeader || ''
     }
   }

   @action doSetLanguage (lang) {
     this.language = lang
   }

   @action getBrowserInfo () {
     var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
     var docAttrs = ['referrer', 'title', 'URL']
     var value = {document: {}, navigator: {}}

     for (let i = 0; i < navAttrs.length; i++) {
       if (navigator[navAttrs[i]] || navigator[navAttrs[i]] === false) {
         value.navigator[navAttrs[i]] = navigator[navAttrs[i]]
       }
     }

     for (let i = 0; i < docAttrs.length; i++) {
       if (document[docAttrs[i]]) {
         value.document[docAttrs[i]] = document[docAttrs[i]]
       }
     }
     return value
   }

   initializeStore (storeName) {
     const store = this

     if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      /* TODO:
      const util = globalRegistry.getUtility(IDeserialize, 'kursinfo-web')
      const importData = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      console.log("importData",importData, "util",util)
      for (let key in importData) {
        // Deserialize so we get proper ObjectPrototypes
        // NOTE! We need to escape/unescape each store to avoid JS-injection
        store[key] = util.deserialize(importData[key])
      }
      delete window.__initialState__[storeName]*/

       const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
       for (let key in tmp) {
         store[key] = tmp[key]
         delete tmp[key]
       }

      // Just a nice helper message
       if (Object.keys(window.__initialState__).length === 0) {
         window.__initialState__ = 'Mobx store state initialized'
       }
     }
   }
}

 export default RouterStore
