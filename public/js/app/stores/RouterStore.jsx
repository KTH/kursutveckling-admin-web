'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, SEMESTER } from '../util/constants'
import { getDateFormat, getLanguageToUse, getAccess } from '../util/helpers'
//import { createDynamicObservableObject } from 'mobx/lib/internal';
//import i18n from '../../../../i18n'
const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray && tmpArray.forEach(element => {
    tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
  })
  return tmpPath
}

function _webUsesSSL(url) {
  return url.startsWith('https:')
}

class RouterStore {

  roundData = {}
  analysisId = ''
  courseData = {}
  semesters = []
  analysisData = undefined
  redisKeys = {
    examiner: [],
    responsibles: []
  }
  language = 1
  status = ''
  usedRounds = []
  hasChangedStatus = false
  courseTitle = ''
  courseCode = ''
  examCommentEmpty = true
  errorMessage = ''
  service = ''
  member = []
  roundAccess = {}

  buildApiUrl(path, params) {
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

  _getOptions(params) { 
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
  @action setCourseTitle(title){
    this.courseTitle = title.length === 0 
    ? '' 
    : {
      name: title.split('_')[0],
      credits: title.split('_')[1]
    }
  }
 
  @action getRoundAnalysis(id, lang = 'sv') {
    return axios.get(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri,
      { id: id/*, lang: lang*/ }),
      this._getOptions()
    ).then(result => {
      //console.log("!!!!getRoundAnalysis", result.data)
      this.status = result.data.isPublished ? 'published' : 'draft'
      this.courseCode = result.data.courseCode
      this.analysisId = result._id
      return this.analysisData = result.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action postRoundAnalysisData(postObject, status) { 
    return axios.post(this.buildApiUrl(this.paths.api.kursutvecklingPost.uri,
      { id: postObject._id, status: status/*, lang: lang*/ }),
      this._getOptions(JSON.stringify(postObject))
    ).then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return "ERROR-" + apiResponse.statusCode
      }
      if (this.status === 'new')
        this.hasChangedStatus = true

      this.status = apiResponse.data.isPublished ? 'published' : 'draft'

      return apiResponse.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action putRoundAnalysisData(postObject, status) {
    return axios.post(this.buildApiUrl(this.paths.api.kursutvecklingPost.uri,
      { id: postObject._id, status: status/*, lang: lang*/ }),
      this._getOptions(JSON.stringify(postObject))
    ).then(apiResponse => {
      //console.log('putRoundAnalysisData', apiResponse)
      if (apiResponse.statusCode >= 400) {
        return "ERROR-" + apiResponse.statusCode
      }
      if (this.status === 'draft' && apiResponse.data.isPublished)
        this.hasChangedStatus = true

      this.status = apiResponse.data.isPublished ? 'published' : 'draft'
      this.analysisId = apiResponse.data._id
      return apiResponse.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action deleteRoundAnalysis(id, lang = 'sv') {
    return axios.delete(this.buildApiUrl(this.paths.api.kursutvecklingDelete.uri,
      { id: id }),
      this._getOptions()
    ).then(result => {
      console.log("!!!!DELETE...", result.data)
      return result.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action getCourseInformation(courseCode, ldapUsername, lang = 'sv') {
    this.courseCode = courseCode
    return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri,
      { courseCode: courseCode, language: lang }),
      this._getOptions()
    ).then((result) => {
      console.log('getCourseInformation', result)
      if (result.status >= 400) {
        return "ERROR-" + result.status
      }
      this.handleCourseData(result.data, ldapUsername, lang)
      return result.body
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action getUsedRounds(courseCode, semester) {
    this.courseCode = courseCode
    return axios.get(this.buildApiUrl(this.paths.api.kursutvecklingGetUsedRounds.uri,
      { courseCode: courseCode, semester: semester }),
      this._getOptions()
    ).then(result => {
      if (result.status >= 400) {
        return "ERROR-" + result.status
      }

      console.log('getUsedRounds', result.data)
      

      return this.usedRounds =  this.analysisAccess(result.data)
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }
  analysisAccess(analysis){
    const memberString = this.member.toString()
    
    for(let draft=0; draft < analysis.draftAnalysis.length; draft ++){
      for(let key = 0; key < analysis.draftAnalysis[draft].ugKeys.length; key ++){
        analysis.draftAnalysis[draft].hasAccess = memberString.indexOf(analysis.draftAnalysis[draft].ugKeys[key]) >= 0
        console.log(memberString.indexOf(key), memberString,key  )
      }
    }

    for(let publ=0; publ < analysis.publishedAnalysis.length; publ ++){
      for( let key = 0; key < analysis.publishedAnalysis[publ].ugKeys.length; key ++){
        analysis.publishedAnalysis[publ].hasAccess = memberString.indexOf(analysis.publishedAnalysis[publ].ugKeys[key]) >= 0
      }
    }
    return analysis
  }



  @action handleCourseData(courseObject, user, language) {
    //console.log('courseObject',courseObject)
    if(courseObject === undefined){
      this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
      return undefined
    }
    try {
      this.courseData = {
        courseCode: courseObject.course.courseCode,
        examinationSets: courseObject.examinationSets,
        gradeScale: courseObject.formattedGradeScales,
        gradeScaleCode: courseObject.course.gradeScaleCode,
        syllabusList: courseObject.publicSyllabusVersions
      }
      this.courseTitle = {
        name: courseObject.course.title,
        credits: courseObject.course.credits
      }

      const thisStore = this
      courseObject.roundInfos.map((round, index) => {
        if (thisStore.semesters.indexOf(round.round.startTerm.term) < 0)
          thisStore.semesters.push(round.round.startTerm.term)

        if (!thisStore.roundData.hasOwnProperty(round.round.startTerm.term)){
          thisStore.roundData[round.round.startTerm.term] = []
          thisStore.roundAccess[round.round.startTerm.term] = {}
          //noAccessToRoundsList(round round.round.startTerm.term)
        }
        thisStore.roundAccess[round.round.startTerm.term][round.round.ladokRoundId] = getAccess(this.member, round, courseObject.course.courseCode)
        thisStore.roundData[round.round.startTerm.term].push({
          roundId: round.round.ladokRoundId,
          language: round.round.language,
          shortName: round.round.shortName,
          startDate: round.round.firstTuitionDate,
          targetGroup: this.getTargetGroup(round),
          hasAccess: getAccess(this.member, round, courseObject.course.courseCode)
        })
      })
      //console.log(this.courseData, this.roundData)
    }

    catch (err) {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    }
  }

  @action createAnalysisData(semester, rounds) {
    this.getEmployees(this.courseData.courseCode, semester, rounds)
  
    return this.getCourseEmployeesPost(this.redisKeys, 'multi', this.language).then(returnList => {
      this.status = 'new'
      this.analysisId = `${this.courseData.courseCode}${semester.toString().match(/.{1,4}/g)[1] === '1' ? 'VT' : 'HT'}${semester.toString().match(/.{1,4}/g)[0]}_${rounds.join('_')}`
      let newName = `${semester.toString().match(/.{1,4}/g)[1] === '1'
        ? SEMESTER[this.language]['1']
        : SEMESTER[this.language]['2']} ${semester.toString().match(/.{1,4}/g)[0]}`

      newName = this.createAnalysisName(newName, this.roundData[semester], rounds)
       
      this.analysisData = {
        _id: this.analysisId,
        alterationText: '',
        analysisFileName: '',
        changedBy: "Kristian Semlan Gullefjun",
        changedDate: '',
        commentChange: '',
        commentExam: this.getExmCommentfromCorrectSyllabus(semester, this.courseData.syllabusList),
        courseCode: this.courseData.courseCode,
        examinationRounds: this.getExamObject(this.courseData.examinationSets, this.courseData.gradeScale, this.language, semester),
        examiners: '',
        examinationGrade: 0,
        isPublished: false,
        pdfAnalysisDate: '',
        pdfPMDate: '',
        programmeCodes: this.getAllTargetGroups(rounds, this.roundData[semester]).join(', '),
        publishedDate: '',
        registeredStudents: 0,
        responsibles: '',
        analysisName: newName,
        semester: semester,
        roundIdList: rounds.toString(),
        ugKeys: [...this.redisKeys.examiner, ...this.redisKeys.responsibles]
      }

      this.analysisData.examiners = ''
      this.analysisData.responsibles = ''
     
      this.analysisData.examiners = this.getEmployeesNames(returnList[0]).join(', ')
      this.analysisData.responsibles = this.getEmployeesNames(returnList[1]).join(', ')

      return this.analysisData
    })
  }


  createAnalysisName(newName, roundList, selectedRounds) {
    let addRounds = []
    let tempName = ''
    let language = getLanguageToUse(roundList, 'English' )
    for (let index = 0; index < roundList.length; index++) {
      tempName = ` ${roundList[index].shortName && roundList[index].shortName.length > 0
        ? roundList[index].shortName
        : newName + '-' + roundList[index].roundId} 
      ( ${language === 'English' ? 'Start date ' : 'Startdatum'} ${getDateFormat(roundList[index].startDate, language)}, ${language} ) `

      if(selectedRounds.indexOf(roundList[index].roundId) >= 0){
        addRounds.push(tempName)
      }
    }
    return `${addRounds.join(', ')}`
  }

  getExmCommentfromCorrectSyllabus(semester, syllabusList) {
    let matchingIndex = 0
    if (syllabusList && syllabusList.length > 0) {
      for (let index = 0; index < syllabusList.length; index++) {
        if (Number(syllabusList[index].validFromTerm.term) > Number(semester)) {
          matchingIndex++
        }
        else {
          return syllabusList[matchingIndex].courseSyllabus.examComments ? syllabusList[matchingIndex].courseSyllabus.examComments : ''
        }
      }
    }
    return 'no comment'
  }

  getTargetGroup(round) {
    if (round.usage.length === 0)
      return []
    let usageList = []
    for (let index = 0; index < round.usage.length; index++) {
      if (usageList.indexOf(round.usage[index].programmeCode) < 0)
        usageList.push(round.usage[index].programmeCode)
    }
    return usageList
  }

  getAllTargetGroups(selectedRounds, roundList) {
    let allTargets = []
    for (let index = 0; index < roundList.length; index++) {
      if(selectedRounds.indexOf(roundList[index].roundId) >= 0){
        allTargets = [...allTargets, ...roundList[index].targetGroup ]
      }
    }
    return allTargets
  }

  getExamObject(dataObject, grades, language = 1, semester = '') {
    var matchingExamSemester = ''

    Object.keys(dataObject).forEach(function (key) {
      if (Number(semester) >= Number(key)) {
        matchingExamSemester = key
      }
    })
    let examString = []
    if (dataObject[matchingExamSemester] && dataObject[matchingExamSemester].examinationRounds.length > 0) {
      for (let exam of dataObject[matchingExamSemester].examinationRounds) {

        //* * Adding a decimal if it's missing in credits **/
        exam.credits = exam.credits !== EMPTY[language] && exam.credits.toString().length === 1 ? exam.credits + '.0' : exam.credits

        examString.push(`${exam.examCode};${exam.title};${language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')};${language === 0 ? 'credits' : 'hp'};${language === 0 ? 'Grading scale' : 'Betygsskala'};${grades[exam.gradeScaleCode]}              
                         `)
      }
    }
    //console.log('!!getExamObject !!!! is ok!!', examString)
    return examString
  }



  getEmployees(courseCode, semester, rounds) {
    this.redisKeys.examiner = []
    this.redisKeys.responsibles = []
    for (let index = 0; index < rounds.length; index++) {
      this.redisKeys.responsibles.push(`${courseCode}.${semester}.${Number(rounds[index])}.courseresponsible`)
    }
    this.redisKeys.examiner.push(`${courseCode}.examiner`)
  }

  getEmployeesNames(employeeList) {
    let list = []
    let toObject

    for (let index = 0; index < employeeList.length; index++) {
      if (employeeList[index] !== null) {
        toObject = JSON.parse(employeeList[index]) 
        for (let index2 = 0; index2 < toObject.length; index2++) {
          if(toObject[index2].givenName)
          list.push(`${toObject[index2].givenName} ${toObject[index2].lastName}`)
        }
      }
    }
    return list
  }

  getMemberOf(memberOf, id){
    console.log('memberOf', memberOf)
    if (id.length > 7) {
      let splitId = id.split('_')
      this.courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
    } else {
      this.courseCode = id.toUpperCase()
    }
    this.member = memberOf.filter((member) => member.indexOf(this.courseCode) > -1)
  }

 /* let rounds = req.params.id.split('-')
      for (let round = 1; round < rounds.length; rounds++) {
        if (getAccess(round)) {
          renderProps.props.children.props.routerStore.analysisAccess = true
          break
        }
      }*/


  /*@action setCourseCode(CourseCode, title = '') {
    this.courseCode = CourseCode
    this.title = title.length > 0 ? title : ''
  }*/

  setLanguage(lang = 'sv'){
    this.language = lang === 'en' ? 0 : 1
  }

  setService(service = 'admin'){
    this.service = service
  }
  /** ***************************************************************************************************************************************** */
  /*                                            UG REDIS - examiners, teachers and responsibles                                                */
  /** ***************************************************************************************************************************************** */
  @action getCourseEmployeesPost(key, type = 'multi', lang = 'sv') {
    return axios.post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key: key, type: type }), this._getOptions(JSON.stringify(this.redisKeys))).then(result => {
      console.log('result.body', result.data)

      return result.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  /** ***********************************************************************************************************************/

  @action getLdapUserByUsername(params) {
    return axios.get(this.buildApiUrl(this.paths.api.searchLdapUser.uri, params), this._getOptions()).then((res) => {
      return res.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
  }

  @action getBreadcrumbs() {
    return {
      url: '/kursinfoadmin/kursutveckling/',
      label: 'TODO'
    }
  }

  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action __SSR__setCookieHeader(cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader || ''
    }
  }

  @action doSetLanguage(lang) {
    this.language = lang
  }

  @action getBrowserInfo() {
    var navAttrs = ['appCodeName', 'appName', 'appMinorVersion', 'cpuClass',
      'platform', 'opsProfile', 'userProfile', 'systemLanguage',
      'userLanguage', 'appVersion', 'userAgent', 'onLine', 'cookieEnabled']
    var docAttrs = ['referrer', 'title', 'URL']
    var value = { document: {}, navigator: {} }

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

  initializeStore(storeName) {
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
