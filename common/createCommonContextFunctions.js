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
  // Temp use of ladokRoundId due to usage in UG Rest Api. Once api is updated then ladokRoundId will be removed and application code will be used only for UG Rest Api
  const roundCourseResponsiblesGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`

  if (memberOfStr.includes(roundCourseResponsiblesGroup)) {
    return true
  }
  // Temp use of ladokRoundId due to usage in UG Rest Api. Once api is updated then ladokRoundId will be removed and application code will be used only for UG Rest Api
  const roundCourseTeachersGroup = `${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.teachers`

  if (memberOfStr.includes(roundCourseTeachersGroup)) {
    return true
  }

  return false
}

// --- Building up courseTitle, courseData, semesters and roundData and check access for rounds ---//
function handleCourseData(courseObject, courseCode, userName, language) {
  if (!courseObject) {
    this.errorMessage = 'Whoopsi daisy... kan just nu inte hämta data från kopps'
    return undefined
  }

  try {
    const { course, formattedGradeScales, termsWithCourseRounds } = courseObject
    this.courseData = {
      courseCode,
      gradeScale: formattedGradeScales,
      semesterObjectList: {},
    }

    this.courseTitle = {
      name: course.title[this.language === 0 ? 'en' : 'sv'],
      credits: course.credits.toString().indexOf('.') < 0 ? course.credits + '.0' : course.credits,
    }

    for (let semesterIndex = 0; semesterIndex < termsWithCourseRounds.length; semesterIndex++) {
      const { courseSyllabus, examinationRounds, term: roundSemester } = termsWithCourseRounds[semesterIndex]
      this.courseData.semesterObjectList[roundSemester] = {
        courseSyllabus,
        examinationRounds,
      }
    }

    const thisStore = this
    termsWithCourseRounds.map(({ term: semester, rounds: semesterRounds }) => {
      if (thisStore.semesters.indexOf(semester) < 0) thisStore.semesters.push(semester)

      if (!thisStore.roundData.hasOwnProperty(semester)) {
        thisStore.roundData[semester] = []
        thisStore.roundAccess[semester] = {}
      }

      thisStore.roundData[semester] = semesterRounds.map(
        round =>
          (round.applicationCode = {
            applicationCode: round.applicationCode,
            // Temp use of ladokRoundId due to usage in UG Rest Api. Once api is updated then this will be removed and application code will be used only for UG Rest Api
            roundId: round.ladokRoundId,
            language: round.language[language],
            shortName: round.shortName,
            startDate: round.firstTuitionDate,
            endDate: round.lastTuitionDate,
            targetGroup: this.getTargetGroup(round),
            ladokUID: round.ladokUID,
            canBeAccessedByUser: resolveUserAccessRights(this.member, round, this.courseCode, semester),
            state: round.state,
          })
      )
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
