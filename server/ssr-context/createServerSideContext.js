'use strict'
const axios = require('axios')

const SUPERUSER_PART = 'kursinfo-admins'
const SEMESTER = [
  {
    1: 'Spring ',
    2: 'Autumn ',
  },
  {
    1: 'VT ',
    2: 'HT ',
  },
]
const EMPTY = ['No information added', 'Ingen information tillagd']

const getAccess = (memberOf, round, courseCode, semester) => {
  if (
    memberOf.toString().indexOf(courseCode.toUpperCase() + '.examiner') > -1 ||
    memberOf.toString().indexOf(SUPERUSER_PART) > -1
  ) {
    return true
  }

  if (
    memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`) > -1
  ) {
    return true
  }

  if (memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.teachers`) > -1) {
    return true
  }

  return false
}

const paramRegex = /\/(:[^\/\s]*)/g

function _paramReplace(path, params) {
  let tmpPath = path
  const tmpArray = tmpPath.match(paramRegex)
  tmpArray &&
    tmpArray.forEach(element => {
      tmpPath = tmpPath.replace(element, '/' + params[element.slice(2)])
    })
  return tmpPath
}

function buildApiUrl(path, params) {
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

/** ***************************************************************************************************************************************** */
/*                                                       COLLECTED ROUND INFORMATION                                                        */
/** ***************************************************************************************************************************************** */
function setCourseTitle(title) {
  this.courseTitle =
    title.length === 0
      ? ''
      : {
          name: title.split('_')[0],
          credits: title.split('_')[1],
        }
}

//--- Building up courseTitle, courseData, semesters and roundData and check access for rounds ---//
function handleCourseData(courseObject, courseCode, userName, language) {
  if (courseObject === undefined) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
    return undefined
  }
  try {
    this.courseData = {
      courseCode,
      gradeScale: courseObject.formattedGradeScales,
      semesterObjectList: {},
    }

    this.courseTitle = {
      name: courseObject.course.title[this.language === 0 ? 'en' : 'sv'],
      credits:
        courseObject.course.credits.toString().indexOf('.') < 0
          ? courseObject.course.credits + '.0'
          : courseObject.course.credits,
    }

    for (let semester = 0; semester < courseObject.termsWithCourseRounds.length; semester++) {
      this.courseData.semesterObjectList[courseObject.termsWithCourseRounds[semester].term] = {
        courseSyllabus: courseObject.termsWithCourseRounds[semester].courseSyllabus,
        examinationRounds: courseObject.termsWithCourseRounds[semester].examinationRounds,
        rounds: courseObject.termsWithCourseRounds[semester].rounds,
      }
    }

    const thisStore = this
    courseObject.termsWithCourseRounds.map((semester, index) => {
      if (thisStore.semesters.indexOf(semester.term) < 0) thisStore.semesters.push(semester.term)

      if (!thisStore.roundData.hasOwnProperty(semester.term)) {
        thisStore.roundData[semester.term] = []
        thisStore.roundAccess[semester.term] = {}
      }

      thisStore.roundData[semester.term] = semester.rounds.map((round, index) => {
        return (round.ladokRoundId = {
          roundId: round.ladokRoundId,
          language: round.language[language],
          shortName: round.shortName,
          startDate: round.firstTuitionDate,
          endDate: round.lastTuitionDate,
          targetGroup: this.getTargetGroup(round),
          ladokUID: round.ladokUID,
          hasAccess: getAccess(this.member, round, this.courseCode, semester.term),
        })
      })
    })
  } catch (err) {
    if (err.response) {
      throw new Error(err.message)
    }
    throw err
  }
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

function getMemberOf(memberOf, id, user, superUser) {
  if (id.length > 7) {
    let splitId = id.split('_')
    this.courseCode = splitId[0].length > 12 ? id.slice(0, 7).toUpperCase() : id.slice(0, 6).toUpperCase()
  } else {
    this.courseCode = id.toUpperCase()
  }
  this.member = memberOf.filter(member => member.indexOf(this.courseCode) > -1 || member.indexOf(superUser) > -1)
  this.user = user
}

function setLanguage(lang = 'sv') {
  this.language = lang === 'en' ? 0 : 1
}

/** ***********************************************************************************************************************/

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

function createServerSideContext() {
  const context = {
    roundData: {}, //List of all rounds from Kopps API with access property
    analysisId: '',
    courseData: {},
    semesters: [], // List of semesters that have rounds for dropdown
    analysisData: undefined, // Object for new analysis
    redisKeys: {
      // Used to get examiners and responsibles from UG Rdedis
      examiner: [],
      responsibles: [],
    },
    language: 1,
    status: '', // Is set in url param to get the right flow, create new analysis or change published
    usedRounds: [], //List of used rounds
    hasChangedStatus: false, //Is set to true when a analysis is saved
    courseTitle: '',
    courseCode: '',
    errorMessage: '', // Error message from API calls
    service: '', // Is set in url param to send back to right page
    member: [], // List of grups the user is member of
    roundAccess: {},
    user: '', //Logged in user name
    statistics: {
      // Result from Ladok api
      examinationGrade: -1,
      endDate: null,
      registeredStudents: -1,
    },
    miniMemosPdfAndWeb: { miniMemos: [] }, // kurs-pm-data-api
    roundNamesWithMissingMemos: '',
    buildApiUrl,
    getTargetGroup,
    getMemberOf,
    setLanguage,
    handleCourseData,
    getBreadcrumbs,
    setBrowserConfig,
    setCourseTitle,
  }
  return context
}

module.exports = { createServerSideContext }
