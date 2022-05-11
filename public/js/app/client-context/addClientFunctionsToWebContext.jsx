'use strict'
import axios from 'axios'
import { EMPTY, SEMESTER } from '../util/constants'
import { getDateFormat, getLanguageToUse } from '../util/helpers'
import { createCommonContextFunctions } from '../../../../common/createCommonContextFunctions'

/** ***************************************************************************************************************************************** */
/*                                                       FILE STORAGE ACTIONS                                                      */
/** ***************************************************************************************************************************************** */
function updateFileInStorage(fileName, metadata) {
  return axios
    .post(this.buildApiUrl(this.paths.storage.updateFile.uri, { fileName }), { params: metadata })
    .then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        return 'ERROR-' + apiResponse.statusCode
      }
      return apiResponse.data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

/** ***************************************************************************************************************************************** */
/*                                               ANALYSIS ACTIONS (kursutveckling - API)                                                      */
/** ***************************************************************************************************************************************** */

function getRoundAnalysis(id) {
  return axios
    .get(this.buildApiUrl(this.paths.api.kursutvecklingGetById.uri, { id }), {
      validateStatus: status => status < 500,
    })
    .then(result => {
      if (result.status >= 400) {
        this.errorMessage = result.data.message
        return { message: 'ERROR-' + result.statusCode }
      }
      this.status = result.data.isPublished ? 'published' : 'draft'
      this.courseCode = result.data.courseCode
      this.analysisId = result.data._id
      this.analysisData = result.data

      return this.analysisData
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function postRoundAnalysisData(postObject, status) {
  return axios
    .post(
      this.buildApiUrl(this.paths.api.kursutvecklingPost.uri, {
        id: postObject._id,
        status,
      }),
      {
        params: JSON.stringify(postObject),
      },
      {
        validateStatus: status => status < 500,
      }
    )
    .then(apiResponse => {
      if (apiResponse.status >= 400) {
        this.errorMessage = apiResponse.data.message
        return { message: 'ERROR-' + apiResponse.status }
      }
      if (this.status === 'new') this.hasChangedStatus = true

      this.status = apiResponse.data.isPublished ? 'published' : 'draft'
      this.analysisId = apiResponse.data._id
      return apiResponse.data
    })
    .catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
}

function putRoundAnalysisData(postObject, status) {
  return axios
    .post(
      this.buildApiUrl(this.paths.api.kursutvecklingPost.uri, {
        id: postObject._id,
        status,
      }),
      {
        params: JSON.stringify(postObject),
      },
      {
        validateStatus: status => status < 500,
      }
    )
    .then(apiResponse => {
      if (apiResponse.status >= 400) {
        this.errorMessage = apiResponse.data.message
        return { message: 'ERROR-' + apiResponse.status }
      }
      this.errorMessage = apiResponse.data.message
      if (this.errorMessage !== undefined) {
        if (this.status === 'draft' && apiResponse.data.isPublished) this.hasChangedStatus = true

        this.status = apiResponse.data.isPublished ? 'published' : 'draft'
        this.analysisId = apiResponse.data._id
      }
      return apiResponse.data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function deleteRoundAnalysis(id, lang = 'sv') {
  return axios
    .delete(this.buildApiUrl(this.paths.api.kursutvecklingDelete.uri, { id }), {
      validateStatus: status => status < 500,
    })
    .then(result => result.data)
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

function getUsedRounds(courseCode, semester) {
  this.courseCode = courseCode
  return axios
    .get(
      this.buildApiUrl(this.paths.api.kursutvecklingGetUsedRounds.uri, {
        courseCode,
        semester,
      }),
      {
        validateStatus: status => status < 500,
      }
    )
    .then(result => {
      if (result.status >= 400) {
        return 'ERROR-' + result.status
      }
      return (this.usedRounds = this._analysisAccess(result.data))
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}
/** ***************************************************************************************************************************************** */
/*                                             GET COURSE INFORMATION ACTION (KOPPS - API)                                                    */
/** ***************************************************************************************************************************************** */
function getCourseInformation(courseCode, userName, lang = 'sv') {
  this.courseCode = courseCode
  return axios
    .get(this.buildApiUrl(this.paths.api.koppsCourseData.uri, { courseCode, language: lang }))
    .then(result => {
      if (result.status >= 400) {
        this.errorMessage = result.statusText
        return 'ERROR-' + result.status
      }
      this.handleCourseData(result.data, courseCode, userName, lang)
      return result.body
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message)
      }
      throw err
    })
}

/** ***************************************************************************************************************************************** */
/*                                             GET ROUND STATISTICS ACTION (KURSSTATISTIK - API)                                                    */
/** ***************************************************************************************************************************************** */
function postLadokRoundIdListAndDateToGetStatistics(ladokRoundIdList, endDate) {
  return axios
    .post(this.buildApiUrl(this.paths.api.kursstatistik.uri, { roundEndDate: endDate }), { params: ladokRoundIdList })
    .then(apiResponse => {
      if (apiResponse.statusCode >= 400) {
        this.errorMessage = result.statusText
        return 'ERROR-' + apiResponse.statusCode
      }

      this.statistics = apiResponse.data.responseObject ? apiResponse.data.responseObject : apiResponse.data
      this.statistics.examinationGrade =
        this.statistics.examinationGrade > 0 ? Math.round(Number(this.statistics.examinationGrade) * 10) / 10 : 0
      this.statistics.endDate = endDate
      return this.statistics
    })
    .catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
}
/** ***************************************************************************************************************************************** */
/*                                                     HANDLE DATA FROM API                                                                  */
/** ***************************************************************************************************************************************** */

// --- Loops through published and draft analyises for access check ---//
function _analysisAccess(analysis) {
  const { memberOfCourseRelatedGroups, otherRoles } = this.member
  const { isKursinfoAdmin, isSchoolAdmin, isSuperUser } = otherRoles

  const memberString = memberOfCourseRelatedGroups.toString()
  for (let draft = 0; draft < analysis.draftAnalysis.length; draft++) {
    for (let key = 0; key < analysis.draftAnalysis[draft].ugKeys.length; key++) {
      analysis.draftAnalysis[draft].canBeAccessedByUser =
        memberString.indexOf(analysis.draftAnalysis[draft].ugKeys[key]) >= 0 ||
        isKursinfoAdmin ||
        isSchoolAdmin ||
        isSuperUser
      if (analysis.draftAnalysis[draft].canBeAccessedByUser === true) break
    }
  }

  for (let publ = 0; publ < analysis.publishedAnalysis.length; publ++) {
    for (let key = 0; key < analysis.publishedAnalysis[publ].ugKeys.length; key++) {
      analysis.publishedAnalysis[publ].canBeAccessedByUser =
        memberString.indexOf(analysis.publishedAnalysis[publ].ugKeys[key]) >= 0 ||
        isKursinfoAdmin ||
        isSchoolAdmin ||
        isSuperUser
      if (analysis.publishedAnalysis[publ].canBeAccessedByUser === true) break
    }
  }
  return analysis
}

// -- Creates a new analysis object with information from selected rounds -- //
function createAnalysisData(semester, rounds) {
  this.getEmployees(this.courseData.courseCode, semester, rounds)
  return this.getCourseEmployeesPost(this.redisKeys, 'multi').then(returnList => {
    const { courseSyllabus, examinationRounds } = this.courseData.semesterObjectList[semester]
    const language = getLanguageToUse(this.roundData[semester], rounds, this.language === 1 ? 'Engelska' : 'English')
    const roundLang = language === 'English' || language === 'Engelska' ? 'en' : 'sv'
    this.analysisId = `${this.courseData.courseCode}${semester.toString().match(/.{1,4}/g)[1] === '1' ? 'VT' : 'HT'}${
      semester.toString().match(/.{1,4}/g)[0]
    }_${rounds.sort().join('_')}`
    this.status = 'new'
    let newName = `${
      semester.toString().match(/.{1,4}/g)[1] === '1'
        ? SEMESTER[roundLang === 'en' ? 0 : 1]['1']
        : SEMESTER[roundLang === 'en' ? 0 : 1]['2']
    } ${semester.toString().match(/.{1,4}/g)[0]}`

    newName = this._createAnalysisName(newName, this.roundData[semester], rounds, roundLang)

    this.analysisData = {
      _id: this.analysisId,
      alterationText: '',
      analysisFileName: '',
      changedBy: this.username,
      changedDate: '',
      commentChange: '',
      commentExam: courseSyllabus.examComments ? courseSyllabus.examComments[roundLang] : '',
      courseCode: this.courseData.courseCode,
      examinationRounds: this.getExamObject(examinationRounds, this.courseData.gradeScale, roundLang),
      examiners: '',
      examinationGrade:
        this.statistics.hasOwnProperty('examinationGrade') && this.statistics.examinationGrade > -1
          ? this.statistics.examinationGrade
          : '',
      endDate: this.statistics.endDate,
      isPublished: false,
      pdfAnalysisDate: '',
      programmeCodes: this.getAllTargetGroups(rounds, this.roundData[semester]).join(', '),
      publishedDate: '',
      registeredStudents:
        this.statistics.hasOwnProperty('registeredStudents') && this.statistics.registeredStudents > -1
          ? this.statistics.registeredStudents
          : '',
      responsibles: '',
      analysisName: newName,
      semester,
      roundIdList: rounds.toString(),
      ugKeys: [...this.redisKeys.examiner, ...this.redisKeys.responsibles],
      ladokUID: '',
      syllabusStartTerm: courseSyllabus.validFromTerm,
      changedAfterPublishedDate: '',
      examinationGradeFromLadok:
        this.statistics.hasOwnProperty('examinationGrade') && this.statistics.examinationGrade > -1,
      registeredStudentsFromLadok:
        this.statistics.hasOwnProperty('registeredStudents') && this.statistics.registeredStudents > -1,
      examinationGradeLadok: this.statistics.examinationGrade,
      registeredStudentsLadok: this.statistics.registeredStudents,
      endDateFromLadok: true,
      endDateLadok: this.statistics.endDate,
    }

    this.analysisData.examiners = ''
    this.analysisData.responsibles = ''

    this.analysisData.examiners = this.getEmployeesNames(returnList[0]).join(', ')
    this.analysisData.responsibles = this.getEmployeesNames(returnList[1]).join(', ')

    return this.analysisData
  })
}

// -- Creates the analysis name based on shortname, semester, start date from selected round(s) --//
function _createAnalysisName(newName, roundList, selectedRounds, language) {
  let addRounds = []
  let tempName = ''
  let thisRoundLanguage = ''
  for (let index = 0; index < roundList.length; index++) {
    thisRoundLanguage = language === 'en' && roundList[index].language === 'Svenska' ? 'Swedish' : ''
    thisRoundLanguage = thisRoundLanguage.length > 0 ? thisRoundLanguage : language === 'en' ? 'English' : 'Svenska'
    tempName = ` ${
      roundList[index].shortName && roundList[index].shortName.length > 0
        ? roundList[index].shortName
        : newName + '-' + roundList[index].roundId
    } ( ${language === 'en' ? 'Start date ' : 'Startdatum'} ${getDateFormat(
      roundList[index].startDate,
      language
    )}, ${thisRoundLanguage} ) ` // don't remove space after it (because it's used later in preview of kurs-pm link)

    if (selectedRounds.indexOf(roundList[index].roundId) >= 0) {
      addRounds.push(tempName)
    }
  }
  return `${addRounds.join(', ')}`
}

// -- Programs that is mandatory for round(s) --//
function getTargetGroup(round) {
  if (round.connectedProgrammes.length === 0) return []
  let usageList = []
  for (let index = 0; index < round.connectedProgrammes.length; index++) {
    if (
      usageList.indexOf(round.connectedProgrammes[index].programmeCode) === -1 &&
      round.connectedProgrammes[index].electiveCondition.en === 'Mandatory'
    ) {
      usageList.push(round.connectedProgrammes[index].programmeCode)
    }
  }
  return usageList
}

function getAllTargetGroups(selectedRounds, roundList) {
  let allTargets = []
  for (let index = 0; index < roundList.length; index++) {
    if (selectedRounds.indexOf(roundList[index].roundId) >= 0) {
      allTargets = [...allTargets, ...roundList[index].targetGroup]
    }
  }
  return allTargets
}

function getExamObject(examObject, grades, roundLang) {
  let examString = []
  const language = roundLang === 'en' ? 0 : 1
  for (let exam of examObject) {
    // -- Adding a decimal if it's missing in credits -- /
    exam.credits =
      exam.credits !== EMPTY[language] && exam.credits.toString().length === 1 ? exam.credits + '.0' : exam.credits

    examString.push(`${exam.examCode};${exam.title[roundLang]};${
      language === 0 ? exam.credits : exam.credits.toString().replace('.', ',')
    };${language === 0 ? 'credits' : 'hp'};${language === 0 ? 'Grading scale' : 'Betygsskala'};${
      grades[exam.gradeScaleCode]
    }              
                         `)
  }
  return examString
}

function getEmployees(courseCode, semester, rounds) {
  this.redisKeys.examiner = []
  this.redisKeys.responsibles = []
  for (let index = 0; index < rounds.length; index++) {
    this.redisKeys.responsibles.push(`${courseCode}.${semester}.${Number(rounds[index])}.courseresponsible`)
  }
  this.redisKeys.examiner.push(`${courseCode}.examiner`)
}

function getEmployeesNames(employeeList) {
  let list = []
  let toObject
  let fullName = ''
  for (let index = 0; index < employeeList.length; index++) {
    if (employeeList[index] !== null) {
      toObject = JSON.parse(employeeList[index])
      for (let index2 = 0; index2 < toObject.length; index2++) {
        if (toObject[index2].givenName) {
          fullName = `${toObject[index2].givenName} ${toObject[index2].lastName}`
          if (list.indexOf(fullName) < 0) list.push(fullName)
        }
      }
    }
  }
  return list
}
/** ***************************************************************************************************************************************** */
/*                                            UG REDIS - examiners, teachers and responsibles                                                */
/** ***************************************************************************************************************************************** */
function getCourseEmployeesPost(key, type = 'multi') {
  return axios
    .post(this.buildApiUrl(this.paths.redis.ugCache.uri, { key, type }), {
      params: JSON.stringify(this.redisKeys),
    })
    .then(result => {
      return result.data
    })
    .catch(err => {
      if (err.response) {
        throw new Error(err.message, err.response.data)
      }
      throw err
    })
}

/* ************************************************************************************************************************/

function getBreadcrumbs() {
  return {
    url: '/kursinfoadmin/kursutveckling/',
    label: 'TODO',
  }
}

function setBrowserConfig(config, paths, apiHost) {
  this.browserConfig = config
  this.paths = paths
  this.apiHost = apiHost
}

function addClientFunctionsToWebContext() {
  const functions = {
    _analysisAccess,
    _createAnalysisName,
    getAllTargetGroups,
    getTargetGroup,
    getExamObject,
    getEmployees,
    getEmployeesNames,
    createAnalysisData,
    updateFileInStorage,
    getRoundAnalysis,
    postRoundAnalysisData,
    putRoundAnalysisData,
    deleteRoundAnalysis,
    getUsedRounds,
    getCourseInformation,
    postLadokRoundIdListAndDateToGetStatistics,
    getCourseEmployeesPost,
    getBreadcrumbs,
    setBrowserConfig,
    ...createCommonContextFunctions(),
  }
  return functions
}

export { addClientFunctionsToWebContext }
