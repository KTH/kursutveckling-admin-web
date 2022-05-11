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

const resolveUserAccessRights = (member, round, courseCode, semester) => {
  const { memberOfCourseRelatedGroups, otherRoles } = member
  const { isExaminator, isKursinfoAdmin, isSchoolAdmin, isSuperUser } = otherRoles

  const memberOfStr = memberOfCourseRelatedGroups.toString()
  if (isExaminator || isKursinfoAdmin || isSchoolAdmin || isSuperUser) {
    return true
  }
  const roundCourseResponsiblesGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`

  if (memberOfStr.includes(roundCourseResponsiblesGroup)) {
    return true
  }

  const roundCourseTeachersGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.teachers`

  if (memberOfStr.includes(roundCourseTeachersGroup)) {
    return true
  }

  return false
}

// --- Building up courseTitle, courseData, semesters and roundData and check access for rounds ---//
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
    courseObject.termsWithCourseRounds.map(semester => {
      if (thisStore.semesters.indexOf(semester.term) < 0) thisStore.semesters.push(semester.term)

      if (!thisStore.roundData.hasOwnProperty(semester.term)) {
        thisStore.roundData[semester.term] = []
        thisStore.roundAccess[semester.term] = {}
      }

      thisStore.roundData[semester.term] = semester.rounds.map(round => {
        return (round.ladokRoundId = {
          roundId: round.ladokRoundId,
          language: round.language[language],
          shortName: round.shortName,
          startDate: round.firstTuitionDate,
          endDate: round.lastTuitionDate,
          targetGroup: this.getTargetGroup(round),
          ladokUID: round.ladokUID,
          canBeAccessedByUser: resolveUserAccessRights(this.member, round, this.courseCode, semester.term),
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

function createCommonContextFunctions() {
  const context = {
    buildApiUrl,
    handleCourseData,
  }
  return context
}

module.exports = { createCommonContextFunctions }
