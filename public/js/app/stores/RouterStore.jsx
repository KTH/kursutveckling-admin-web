 'use strict'
 import { observable, action } from 'mobx'
 import axios from 'axios'
 import { safeGet } from 'safe-utils'
 import { EMPTY, SEMESTER} from '../util/constants'
//import { createDynamicObservableObject } from 'mobx/lib/internal';
 //import i18n from '../../../../i18n'
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

   @observable roundData = {}
   @observable analysisId = ""
   @observable courseData = {}
   @observable semesters = []
   @observable analysisData = undefined
   redisKeys ={
    examiner:[],
    responsibles:[]
  }
  language = 1


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

   _getOptions (params) { 

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
   @action getRoundAnalysis (id, lang='sv') { console.log(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri, { id:id/*, lang: lang*/}), this._getOptions())
     return axios.get(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri, { id:id/*, lang: lang*/}), this._getOptions()).then(result => {
       console.log("!!!!getRoundAnalysis",result.data)
       this.status= result.data.isPublished ? 'published' : 'saved'
       this.analysisData = result.data
     }).catch(err => {
       if (err.response) {
         throw new Error(err.message)
       }
       throw err
     })
   }

   @action postRoundAnalysisData (postObject, status) {
     return axios.post(this.buildApiUrl(this.paths.api.kursutvecklingPost.uri,
                      { id:postObject._id, status: status/*, lang: lang*/}),
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

   @action putRoundAnalysisData (postObject, status) {
    return axios.post(this.buildApiUrl(this.paths.api.kursutvecklingPost.uri,
                     { id:postObject._id, status: status/*, lang: lang*/}),
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

  @action handleCourseData(courseObject, user, language){
    console.log(courseObject)
    this.status= 'new'
    try{
    safeGet(() => {
   
    this.courseData={
      courseCode: courseObject.course.courseCode,
      examinationSets: courseObject.examinationSets,
      gradeScale: courseObject.formattedGradeScales,
      gradeScaleCode: courseObject.course.gradeScaleCode,
      syllabusList: courseObject.publicSyllabusVersions
    }
    this.courseData.title = {
      name: courseObject.course.title,
      credits: courseObject.course.credits
    }
    
    const thisStore = this
     courseObject.roundInfos.map((round, index) =>{ 
      if(thisStore.semesters.indexOf(round.round.startTerm.term) < 0)
       thisStore.semesters.push(round.round.startTerm.term)
      
      if(!thisStore.roundData.hasOwnProperty(round.round.startTerm.term))
       thisStore.roundData[round.round.startTerm.term]=[]

      thisStore.roundData[round.round.startTerm.term].push({
        roundId: round.round.ladokRoundId,
        language: round.round.language,
        shortName: round.round.shortName,
        startDate: round.round.startDate,
        targetGroup: this.getTargetGroup(round)
      })
    })

  }, 'kopps not responding')
    console.log(this.courseData, this.roundData)
}
catch(err){
  if (err.response) {
    throw new Error(err.message)
  }
  throw err
}
  }

  @action createAnalysisData(semester, rounds){
    this.state = "pending"
    const newId = `${this.courseData.courseCode}${semester.toString().match(/.{1,4}/g)[1] === '1' ? 'VT' : 'HT'}${semester.toString().match(/.{1,4}/g)[0]}_${rounds.join('_')}`
    let newName = `${semester.toString().match(/.{1,4}/g)[1] === '1' ? SEMESTER[this.language]['1'] : SEMESTER[this.language]['2']} ${semester.toString().match(/.{1,4}/g)[0]}`
    
    if(rounds.length > 1)
      newName = this.createAnalysisName(newName, this.roundData[semester], rounds)
  
    this.analysisData ={
      _id: newId,
      alterationText: " ",
      changedBy: " ",
      changedDate: " ",
      commentChange: " ",
      commentExam: this.getExmCommentfromCorrectSyllabus(semester, this.courseData.syllabusList),
      courseCode: this.courseData.courseCode,
      examinationRounds: this.getExamObject( this.courseData.examinationSets, this.courseData.gradeScale, this.language, semester),
      examiners: " ",
      examinationGrade: 0,
      isPublished: false,
      pdfAnalysisDate: " ",
      programmeCodes: this.getAllTargetGroups(rounds, this.roundData[semester]).join(', '),
      publishedDate: "",
      registeredStudents: 0,
      responsibles: " ",
      round: newName
    }

    this.getEmployees(this.courseData.courseCode, semester, rounds)
    this.getCourseEmployeesPost(this.redisKeys, 'multi', this.language).then(returnList=> {
      console.log('returnList', returnList)
      this.analysisData.examiners = this.getEmployeesNames(returnList[0]).join(', ')
      this.analysisData.responsibles = this.getEmployeesNames(returnList[1]).join(', ')
      this.state = "done"
      
     return this.analysisData
    })
  }


  createAnalysisName(newName, roundList, rounds){
    let addRounds = []
    for(let index = 0; index < rounds.length; index ++){
      addRounds.push(roundList[rounds[index]].shortName.length > 0 ? roundList[rounds[index]].shortName : roundList[rounds[index]].startDate)
    }
      return `${newName} ( ${addRounds.join(', ')} )` 
  }

  getExmCommentfromCorrectSyllabus(semester, syllabusList){
    let matchingIndex = 0
    if(syllabusList && syllabusList.length > 0){
      for( let index = 0; index < syllabusList.length; index ++){
        if(Number(syllabusList[index].validFromTerm.term) > Number(semester)){
          matchingIndex ++
        }
        else{
          return syllabusList[matchingIndex].courseSyllabus.examComments ? syllabusList[matchingIndex].courseSyllabus.examComments : ''
        }
      }
    }
    return 'no comment'
  } 

  getTargetGroup(round){
    if(round.usage.length === 0)
      return []
    let usageList = []
    for(let index=0; index < round.usage.length; index ++){
      if(usageList.indexOf(round.usage[index].programmeCode) < 0)
      usageList.push(round.usage[index].programmeCode)
    }
    return usageList
  }

  getAllTargetGroups(rounds, roundDataList){
      let allTargets=[]
      for(let index = 0; index < rounds.length; index++){
        allTargets = [...allTargets, ...roundDataList[Number(rounds[index])-1].targetGroup]
      }
      return allTargets
  }

  getExamObject (dataObject, grades, language = 1, semester = '') {console.log(dataObject)
   
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

        examString.push(`${exam.examCode} - ${exam.title},${language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')} ${language === 0 ? ' credits' : ' hp'}, ${language === 0 ? 'Grading scale' : 'Betygskala'}: ${grades[exam.gradeScaleCode]}              
                         `)
      }
    }
    console.log('!!getExamObject is ok!!', grades)
    return examString
  }

  getEmployees(courseCode, semester, rounds){
    for(let index = 0; index < rounds.length; index++){
      this.redisKeys.responsibles.push(`${courseCode}.${semester}.${rounds[index]}.courseresponsible`)
    }
    this.redisKeys.examiner.push(`${courseCode}.examiner`)
  }

  getEmployeesNames(employeeList){
    let list = []
    let toObject
    //employeeList = JSON.parse(employeeList)
    
    for(let index = 0; index < employeeList.length; index++){
      if(employeeList[index] !== null){
        toObject = JSON.parse(employeeList[index])
        for(let index2 = 0; index2 < toObject.length; index2++){
          list.push(`${toObject[index2].givenName} ${toObject[index2].lastName}`)
        }
      }
    }
    return list
  }

 


/** ***************************************************************************************************************************************** */
/*                                            UG REDIS - examiners, teachers and responsibles                                                */
/** ***************************************************************************************************************************************** */
   @action getCourseEmployeesPost (key, type = 'multi', lang = 'sv') {
    return axios.post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key:key, type:type }), this._getOptions(JSON.stringify(this.redisKeys))).then(result => {
       console.log('result.body', result.data)
       
      return result.data
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
