'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'
import { safeGet } from 'safe-utils'
import { EMPTY, SEMESTER } from '../util/constants'
import { getDateFormat, getLanguageToUse, getAccess } from '../util/helpers'
//const log = require('kth-node-log')
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
  user =''

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

  /** ***************************************************************************************************************************************** */
  /*                                                       FILE STORAGE ACTIONS                                                      */
  /** ***************************************************************************************************************************************** */
  @action updateFileInStorage(fileName, metadata) { 
    return axios.post(this.buildApiUrl(this.paths.storage.updateFile.uri,
      { fileName: fileName}),
      this._getOptions({ metadata })
    ).then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return "ERROR-" + apiResponse.statusCode
      }
      return apiResponse.data
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

  @action deleteFileInStorage(id){
    return axios.post(this.buildApiUrl(this.paths.storage.deleteFile.uri,
      { id: id }),
      this._getOptions()
    ).then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return "ERROR-" + apiResponse.statusCode
      }
      return apiResponse.data
    })
  }

  /** ***************************************************************************************************************************************** */
  /*                                               ANALYSIS ACTIONS (kursutveckling - API)                                                      */
  /** ***************************************************************************************************************************************** */
 
  @action getRoundAnalysis(id, lang = 'sv') {
    return axios.get(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri,
      { id: id }),
      this._getOptions()
    ).then(result => {
      //console.log("!!!!getRoundAnalysis", result.data)
      if (result.statusCode >= 400) {
        this.errorMessage = result.statusText
        return "ERROR-" + result.statusCode
      }
      this.status = result.data.isPublished ? 'published' : 'draft'
      this.courseCode = result.data.courseCode
      this.analysisId = result.data._id
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
        this.errorMessage = result.statusText
        return "ERROR-" + apiResponse.statusCode
      }
      if (this.status === 'new')
        this.hasChangedStatus = true

      this.status = apiResponse.data.isPublished ? 'published' : 'draft'
      this.analysisId = apiResponse.data._id
      return apiResponse.data
    }).catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
        //throw new Error(err.message)
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
        this.errorMessage = result.statusText
        return "ERROR-" + apiResponse.statusCode
      }
      this.errorMessage = apiResponse.data.message
      if(this.errorMessage !== undefined){
      if (this.status === 'draft' && apiResponse.data.isPublished)
        this.hasChangedStatus = true

      this.status = apiResponse.data.isPublished ? 'published' : 'draft'
      this.analysisId = apiResponse.data._id
      }
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
      return result.data
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
      return this.usedRounds =  this.analysisAccess(result.data)
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }
  /** ***************************************************************************************************************************************** */
  /*                                             GET COURSE INFORMATION ACTION (KOPPS - API)                                                    */
  /** ***************************************************************************************************************************************** */
  @action getCourseInformation(courseCode, ldapUsername, lang = 'sv') {
    this.courseCode = courseCode
    return axios.get(this.buildApiUrl(this.paths.api.koppsCourseData.uri,
      { courseCode: courseCode, language: lang }),
      this._getOptions()
    ).then((result) => {
      //log.info('getCourseInformation: ' + result)
      if (result.status >= 400) {
        this.errorMessage = result.statusText
        return "ERROR-" + result.status
      }
      this.handleCourseData(result.data, courseCode, ldapUsername, lang)
      return result.body
    }).catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
  }

 /** ***************************************************************************************************************************************** */
  /*                                                     HANDLE DATA FROM API                                                                  */
  /** ***************************************************************************************************************************************** */

  
  analysisAccess(analysis){
    // Loops thrue published and draft analyises for access check
    const memberString = this.member.toString()
    
    for(let draft=0; draft < analysis.draftAnalysis.length; draft ++){
      for(let key = 0; key < analysis.draftAnalysis[draft].ugKeys.length; key ++){
        analysis.draftAnalysis[draft].hasAccess = memberString.indexOf(analysis.draftAnalysis[draft].ugKeys[key]) >= 0
        if(analysis.draftAnalysis[draft].hasAccess === true)
          break
      }
    }

    for(let publ=0; publ < analysis.publishedAnalysis.length; publ ++){
      for( let key = 0; key < analysis.publishedAnalysis[publ].ugKeys.length; key ++){
        analysis.publishedAnalysis[publ].hasAccess = memberString.indexOf(analysis.publishedAnalysis[publ].ugKeys[key]) >= 0
        if(analysis.publishedAnalysis[publ].hasAccess === true)
          break
      }
    }
    return analysis
  }



  @action handleCourseData(courseObject, courseCode, ldapUsername, language) {
    // Building up courseTitle, courseData, semesters and roundData
    if(courseObject === undefined){
      this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
      return undefined
    }
    try {
      console.log('courseObject', courseObject)
      this.courseData = {
        courseCode,
        gradeScale: courseObject.formattedGradeScales,
        semesterObjectList: {}
      }
      this.courseTitle = {
        name: courseObject.course.title[this.language === 0 ? 'en' : 'sv'],
        credits: courseObject.course.credits
      }

      for(let semester = 0; semester < courseObject.termsWithCourseRounds.length; semester ++){
          this.courseData.semesterObjectList[courseObject.termsWithCourseRounds[semester].term]= {
          courseSyllabus: courseObject.termsWithCourseRounds[semester].courseSyllabus,
          examinationRounds: courseObject.termsWithCourseRounds[semester].examinationRounds,
          rounds: courseObject.termsWithCourseRounds[semester].rounds
        }
      }

      const thisStore = this
      courseObject.termsWithCourseRounds.map((semester, index) => {
        if (thisStore.semesters.indexOf(semester.term) < 0)
          thisStore.semesters.push(semester.term)

        if (!thisStore.roundData.hasOwnProperty(semester.term)){
          thisStore.roundData[semester.term] = []
          thisStore.roundAccess[semester.term] = {}
        }
      
        thisStore.roundData[semester.term] = semester.rounds.map((round, index) => { 
          return round.ladokRoundId = {
            roundId: round.ladokRoundId,
            language: round.language[language],
            shortName: round.shortName,
            startDate: round.firstTuitionDate,
            targetGroup: this.getTargetGroup(round),
            ladokUID: round.ladokUID,
            hasAccess: getAccess(this.member, round, this.courseCode, semester.term)
          }
        })
      })
    } catch (err) {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    }
  }

  @action createAnalysisData(semester, rounds) {
    // Creates a new analysis object with information from selected rounds

    this.getEmployees(this.courseData.courseCode, semester, rounds)
    return this.getCourseEmployeesPost(this.redisKeys, 'multi', this.language).then(returnList => {

      const {courseSyllabus, examinationRounds } = this.courseData.semesterObjectList[semester]
      const language = getLanguageToUse( this.roundData[semester], rounds, 'English' ) 
      const roundLang = language === 'English' || language === 'Engelska' ? 'en' : 'sv'
      this.analysisId = `${this.courseData.courseCode}${semester.toString().match(/.{1,4}/g)[1] === '1' ? 'VT' : 'HT'}${semester.toString().match(/.{1,4}/g)[0]}_${rounds.sort().join('_')}`
      this.status = 'new'
      let newName = `${semester.toString().match(/.{1,4}/g)[1] === '1'
        ? SEMESTER[roundLang === 'en' ? 0 : 1]['1']
        : SEMESTER[roundLang === 'en' ? 0 : 1]['2']} ${semester.toString().match(/.{1,4}/g)[0]}`

      newName = this.createAnalysisName(newName, this.roundData[semester], rounds, roundLang)
       
      this.analysisData = {
        _id: this.analysisId,
        alterationText: '',
        analysisFileName: '',
        pmFileName: '',
        changedBy: this.user, 
        changedDate: '',
        commentChange: '',
        commentExam: courseSyllabus.examComments ? courseSyllabus.examComments[roundLang] : '', //todo
        courseCode: this.courseData.courseCode,
        examinationRounds: this.getExamObject( examinationRounds, this.courseData.gradeScale, roundLang),
        examiners: '',
        examinationGrade: '',
        isPublished: false,
        pdfAnalysisDate: '',
        pdfPMDate: '',
        programmeCodes: this.getAllTargetGroups(rounds, this.roundData[semester]).join(', '),
        publishedDate: '',
        registeredStudents: '',
        responsibles: '',
        analysisName: newName,
        semester: semester,
        roundIdList: rounds.toString(),
        ugKeys: [...this.redisKeys.examiner, ...this.redisKeys.responsibles],
        ladokUID: '',
        syllabusStartTerm: courseSyllabus.validFromTerm,
        changedAfterPublishedDate: '',
        examinationGradeFromLadok: false,
        registeredStudentsFromLadok: false

      }

      this.analysisData.examiners = ''
      this.analysisData.responsibles = ''
     
      this.analysisData.examiners = this.getEmployeesNames(returnList[0]).join(', ')
      this.analysisData.responsibles = this.getEmployeesNames(returnList[1]).join(', ')

      return this.analysisData
    })
  }


  createAnalysisName(newName, roundList, selectedRounds, language) {
    // Creates the analysis name based on shortname, semester, start date from selevted round(s)
    let addRounds = []
    let tempName = ''
    let thisRoundLanguage = ''
    for (let index = 0; index < roundList.length; index++) {
      thisRoundLanguage = language === 'en' && roundList[index].language === 'Svenska' ? 'Swedish' : ''
      thisRoundLanguage = thisRoundLanguage.length > 0 ? thisRoundLanguage : language === 'en' ? 'English' : 'Svenska'
      tempName = ` ${roundList[index].shortName && roundList[index].shortName.length > 0 ? roundList[index].shortName : newName + '-' + roundList[index].roundId} ( ${language === 'en' ? 'Start date ' : 'Startdatum'} ${getDateFormat(roundList[index].startDate, language)}, ${thisRoundLanguage} ) `

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
    if (round.connectedProgrammes.length === 0)
      return []
    let usageList = []
    for (let index = 0; index < round.connectedProgrammes.length; index++) {
      if (usageList.indexOf(round.connectedProgrammes[index].programmeCode) === -1 && round.connectedProgrammes[index].electiveCondition.en === 'Mandatory'){
        usageList.push(round.connectedProgrammes[index].programmeCode)
      }
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

  getExamObject(examObject, grades, roundLang) {
      let examString = []
      const language = roundLang === 'en' ? 0 : 1
      for (let exam of examObject) {
        //* * Adding a decimal if it's missing in credits **/
        exam.credits = exam.credits !== EMPTY[language] && exam.credits.toString().length === 1 ? exam.credits + '.0' : exam.credits

        examString.push(`${exam.examCode};${exam.title[roundLang]};${language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')};${language === 0 ? 'credits' : 'hp'};${language === 0 ? 'Grading scale' : 'Betygsskala'};${grades[exam.gradeScaleCode]}              
                         `)
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
    let fullName = ''
    for (let index = 0; index < employeeList.length; index++) {
      if (employeeList[index] !== null) {
        toObject = JSON.parse(employeeList[index]) 
        for (let index2 = 0; index2 < toObject.length; index2++) {
          if(toObject[index2].givenName){
            fullName = `${toObject[index2].givenName} ${toObject[index2].lastName}`
            if(list.indexOf(fullName) < 0 )
              list.push(fullName)
          }
        }
      }
    }
    return list
  }

  getMemberOf(memberOf, id, ldapUsername){
    if (id.length > 7) {
      let splitId = id.split('_')
      this.courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
    } else {
      this.courseCode = id.toUpperCase()
    }
    this.member = memberOf.filter((member) => member.indexOf(this.courseCode) > -1)
    this.user = ldapUsername
  }

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
      //console.log('result.body', result.data)

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
