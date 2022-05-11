'use strict'

const { parseCourseCode } = require('../utils/courseCodeParser')
const { createCommonContextFunctions } = require('../../common/createCommonContextFunctions')
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

function setMemberInfo(loggedInUser, id, username) {
  this.courseCode = parseCourseCode(id.toUpperCase())
  const { memberOf, roles } = loggedInUser

  this.member = {
    memberOfCourseRelatedGroups: memberOf.filter(member => member.indexOf(this.courseCode) > -1),
    otherRoles: roles,
  }
  this.username = username
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
    roundData: {}, // List of all rounds from Kopps API with access property
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
    usedRounds: [], // List of used rounds
    hasChangedStatus: false, // Is set to true when a analysis is saved
    courseTitle: '',
    courseCode: '',
    errorMessage: '', // Error message from API calls
    service: '', // Is set in url param to send back to right page
    member: [], // List of grups the user is member of
    roundAccess: {},
    username: '', // Logged in user name
    statistics: {
      // Result from Ladok api
      examinationGrade: -1,
      endDate: null,
      registeredStudents: -1,
    },
    miniMemosPdfAndWeb: { miniMemos: [] }, // kurs-pm-data-api
    roundNamesWithMissingMemos: '',
    getTargetGroup,
    setLanguage,
    setMemberInfo,
    getBreadcrumbs,
    setBrowserConfig,
    setCourseTitle,
    ...createCommonContextFunctions(),
  }
  return context
}

module.exports = { createServerSideContext }
