'use strict'

const language = require('@kth/kth-node-web-common/lib/language')
const { hasGroup } = require('@kth/kth-node-passport-oidc')
const koppsCourseData = require('./apiCalls/koppsCourseData')
const log = require('@kth/log')

const i18n = require('../i18n')

function _hasThisTypeGroup(courseCode, courseInitials, user, employeeType) {
  // 'edu.courses.SF.SF1624.20192.1.courseresponsible'
  // 'edu.courses.SF.SF1624.20182.9.teachers'

  const groups = user.memberOf
  const startWith = `edu.courses.${courseInitials}.${courseCode}.` // TODO: What to do with years 20192. ?
  const endWith = `.${employeeType}`
  if (groups && groups.length > 0) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].indexOf(startWith) >= 0 && groups[i].indexOf(endWith) >= 0) {
        return true
      }
    }
  }
  return false
}

const schools = () => ['abe', 'eecs', 'itm', 'cbh', 'sci']

async function _isAdminOfCourseSchool(courseCode, user, roles) {
  // app.kursinfo.skoladmin.***
  const userGroups = user.memberOf

  if (!userGroups || userGroups?.length === 0) return false

  const userSchools = schools().filter(schoolCode => userGroups.includes(`app.kursinfo.skoladmin.${schoolCode}`))

  if (userSchools.length === 0) return false
  const courseSchoolCode = await koppsCourseData.getCourseSchool(courseCode)
  log.info('Fetched courseSchoolCode to define user role', { courseSchoolCode, userSchools })

  if (courseSchoolCode === 'missing_school_code' || courseSchoolCode === 'kopps_get_fails') {
    log.info('Has problems with fetching school code to define if user is a school admin', {
      message: courseSchoolCode,
    })
    return false
  }

  const hasSchoolCodeInAdminGroup = userSchools.includes(courseSchoolCode.toLowerCase())
  log.debug('User admin role', { hasSchoolCodeInAdminGroup })

  // think about missing course code

  return hasSchoolCodeInAdminGroup
}

function _parseCourseCode(courseCodeOrAnalysisId) {
  const analysisIdStrMinLength = 7

  if (courseCodeOrAnalysisId.length <= analysisIdStrMinLength) return courseCodeOrAnalysisId

  // SK2560VT2016_1
  const [courseCodeAndSemester] = courseCodeOrAnalysisId.split('_')
  const semesterStrLength = 6
  const courseCode = courseCodeAndSemester.slice(0, -6)
  return courseCode
}
const messageHaveNotRights = lang => ({
  status: 403,
  showMessage: true,
  message: i18n.message('message_have_not_rights', lang),
})
// eslint-disable-next-line func-names
module.exports.requireRole = (...roles) =>
  function _hasCourseAcceptedRoles(req, res, next) {
    const lang = language.getLanguage(res)

    const { id } = req.params
    const { user = {} } = req.session.passport

    const courseCode = _parseCourseCode(id.toUpperCase())
    const courseInitials = id.slice(0, 2).toUpperCase()

    const basicUserCourseRoles = {
      isExaminator: hasGroup(`edu.courses.${courseInitials}.${courseCode}.examiner`, user),
      isCourseResponsible: _hasThisTypeGroup(courseCode, courseInitials, user, 'courseresponsible'),
      isSuperUser: user.isSuperUser,
      isCourseTeacher: _hasThisTypeGroup(courseCode, courseInitials, user, 'teachers'),
    }

    // If we don't have one of these then access is forbidden
    const hasBasicAuthorizedRole = roles.reduce((prev, curr) => prev || basicUserCourseRoles[curr], false)

    if (hasBasicAuthorizedRole) return next()

    if (!hasBasicAuthorizedRole && !roles.includes('isSchoolAdmin')) return next(messageHaveNotRights(lang))

    _isAdminOfCourseSchool(courseCode, user).then(isAdminOfCourseSchool => {
      if (isAdminOfCourseSchool) return next()
      else next(messageHaveNotRights(lang))
    })
  }
