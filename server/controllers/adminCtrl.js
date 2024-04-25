'use strict'

const log = require('@kth/log')
const language = require('@kth/kth-node-web-common/lib/language')
const httpResponse = require('@kth/kth-node-response')
const { ugRestApiHelper } = require('@kth/ug-rest-api-helper')
const paths = require('../server').getPaths()
const browserConfig = require('../configuration').browser
const serverConfig = require('../configuration').server
const api = require('../api')
const kursutvecklingAPI = require('../apiCalls/kursutvecklingAPI')
const koppsCourseData = require('../apiCalls/koppsCourseData')
const kursstatistikAPI = require('../apiCalls/kursstatistikAPI')
const i18n = require('../../i18n')
const { runBlobStorage, updateMetaData } = require('../blobStorage')
const { getSortedAndPrioritizedMiniMemosWebOrPdf } = require('../apiCalls/kursPmDataApi')
const { getServerSideFunctions } = require('../utils/serverSideRendering')
const { parseCourseCode } = require('../utils/courseCodeParser')
const { createServerSideContext } = require('../ssr-context/createServerSideContext')

// ------- ANALYSES FROM KURSUTVECKLING-API: POST, GET, DELETE, GET USED ROUNDS ------- /

async function _postRoundAnalysis(req, res, next) {
  const { id: roundAnalysisId, status: isNewAnalysis, lang = 'sv' } = req.params
  const sendObject = JSON.parse(req.body.params)
  log.debug('_postRoundAnalysis id:' + req.params.id)
  try {
    let apiResponse = {}
    if (isNewAnalysis === 'true') {
      apiResponse = await kursutvecklingAPI.setRoundAnalysisData(roundAnalysisId, sendObject, lang)
    } else {
      apiResponse = await kursutvecklingAPI.updateRoundAnalysisData(roundAnalysisId, sendObject, lang)
    }

    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
  } catch (err) {
    log.error('Exception from setRoundAnalysis ', { error: err })
    return next(err)
  }
}

async function _getRoundAnalysis(req, res, next) {
  const roundAnalysisId = req.params.id || ''
  const { lang = 'sv' } = req.params
  log.debug('Fetching _getRoundAnalysis id:' + req.params.id)
  try {
    const apiResponse = await kursutvecklingAPI.getRoundAnalysisData(roundAnalysisId, lang)
    if (apiResponse.body) log.debug('Fetched analysis', { body: apiResponse.body })
    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
  } catch (err) {
    log.error('Exception from getRoundAnalysis ', { error: err })
    return next(err)
  }
}

async function _deleteRoundAnalysis(req, res, next) {
  const { id: roundAnalysisId } = req.params
  log.debug('_deleteRoundAnalysis with id:' + req.params.id)
  try {
    const apiResponse = await kursutvecklingAPI.deleteRoundAnalysisData(roundAnalysisId)
    return httpResponse.json(res, apiResponse, apiResponse.statusCode)
  } catch (err) {
    log.error('Exception from _deleteRoundAnalysis ', { error: err })
    return next(err)
  }
}

async function _getUsedRounds(req, res, next) {
  const { courseCode, semester } = req.params
  log.debug('_getUsedRounds with course code: ' + courseCode + 'and semester: ' + semester)
  try {
    const apiResponse = await kursutvecklingAPI.getUsedRounds(courseCode, semester)
    log.debug('_getUsedRounds response: ', { body: apiResponse.body })
    return httpResponse.json(res, apiResponse.body, apiResponse.statusCode)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error })
    return next(error)
  }
}

// ------- COURSE DATA FROM KOPPS-API   ------- /
async function _getKoppsCourseData(req, res, next) {
  const { courseCode } = req.params
  log.debug('_getKoppsCourseData with code:', { courseCode })
  try {
    const { body, statusCode } = await koppsCourseData.getKoppsCourseData(courseCode)
    return httpResponse.json(res, body, statusCode)
  } catch (err) {
    log.error('Exception from koppsAPI ', { error: err })
    return next(err)
  }
}

// ------- FILES IN BLOB STORAGE: SAVE, UPDATE, DELETE ------- /
async function _saveFileToStorage(req, res, next) {
  const { file } = req.files
  log.debug('Saving uploaded file to storage ', { file })

  try {
    const fileName = await runBlobStorage(file, req.params.analysisid, req.params.type, req.params.published, req.body)
    return httpResponse.json(res, fileName)
  } catch (error) {
    log.error('Exception from saveFileToStorage ', { error })
    return next(error)
  }
}

async function _updateFileInStorage(req, res, next) {
  log.debug('_updateFileInStorage file name:' + req.params.fileName + ', metadata:' + req.body.params.metadata)
  try {
    const response = await updateMetaData(req.params.fileName, req.body.params.metadata)
    return httpResponse.json(res, response)
  } catch (error) {
    log.error('Exception from updateFileInStorage ', { error })
    return next(error)
  }
}

const _removeDuplicates = personListWithDublicates =>
  personListWithDublicates
    .map(person => JSON.stringify(person))
    .filter((person, index, arr) => arr.indexOf(person) === index)
    .map(personStr => JSON.parse(personStr))

const _getCourseEmployeeDataForExaminerAndResponsibles = (groupData, groups) => {
  let examiners = []
  let responsibles = []
  if (groupData && groupData.length > 0) {
    groupData.forEach(group => {
      const examinerGroupNames = groups.examiner
      const examinerGroup = examinerGroupNames.find(x => `edu.courses.${String(x).slice(0, 2)}.${x}` === group.name)
      if (examinerGroup) {
        examiners = examiners.concat(group.members)
      } else {
        const responsibleGroupNames = groups.responsibles
        const responsibleGroup = responsibleGroupNames.find(
          x => `edu.courses.${String(x).slice(0, 2)}.${x}` === group.name
        )
        if (responsibleGroup) {
          responsibles = responsibles.concat(group.members)
        }
      }
    })
  }
  const employeeData = []
  employeeData.push(_removeDuplicates(examiners))
  employeeData.push(_removeDuplicates(responsibles))
  return employeeData
}

async function _getGroupsDataFromUG(groups) {
  const { url, key } = serverConfig.ugRestApiURL
  const { authTokenURL, authClientId, authClientSecret } = serverConfig.ugAuth
  const ugConnectionProperties = {
    authorityURL: authTokenURL,
    clientId: authClientId,
    clientSecret: authClientSecret,
    ugURL: url,
    subscriptionKey: key,
  }
  ugRestApiHelper.initConnectionProperties(ugConnectionProperties)
  const filterData = []
  for (const groupKey in groups) {
    const data = groups[groupKey]
    data.forEach(d => {
      filterData.push(`edu.courses.${String(d).slice(0, 2)}.${d}`)
    })
  }
  const groupData = await ugRestApiHelper.getUGGroups('name', 'in', filterData, true)
  return groupData
}

// ------- EXAMINATOR AND RESPONSIBLES FROM UG-REST-API: ------- //
async function _getCourseEmployees(req, res, next) {
  try {
    const groups = JSON.parse(req.body.params)
    const groupData = await _getGroupsDataFromUG(groups)
    const courseEmployeeData = _getCourseEmployeeDataForExaminerAndResponsibles(groupData, groups)
    log.debug('Examiners Fetched from UG', { Examiners: courseEmployeeData[0] })
    log.debug('Responsibles Fetched from UG', { Responsibles: courseEmployeeData[1] })
    return httpResponse.json(res, courseEmployeeData)
  } catch (err) {
    log.error('Exception from UG Rest Api - multi', { error: err })
    return next(err)
  }
}

async function _getStatisicsForRound(req, res, next) {
  log.debug('_getStatisicsForRound : ', req.body.params, req.params.roundEndDate)
  // Solution for rounds that missing ladokUID in kopps
  if (req.body.params.length === 0) {
    const reponseObject = { registeredStudents: -1, examinationGrade: -1 }
    return httpResponse.json(res, reponseObject, 200)
  }
  try {
    const apiResponse = await kursstatistikAPI.getStatisicsForRound(req.params.roundEndDate, req.body.params)
    log.debug('_getStatisicsForRound response: ', apiResponse.body)
    return httpResponse.json(res, apiResponse.body)
  } catch (error) {
    log.error('Exception from _getUsedRounds ', { error })
    return next(error)
  }
}

async function getIndex(req, res, next) {
  /** ------- CHECK OF CONNECTION TO API AND UG_REDIS ------- */
  if (api.kursutvecklingApi.connected === false) {
    log.error('No connection to kursutveckling-api', api.kursutvecklingApi)
    const error = new Error('API - ERR_CONNECTION_REFUSED')
    error.status = 500
    return next(error)
  }

  const lang = language.getLanguage(res) || 'sv'
  const { passport: userPassport } = req.session
  const { user: loggedInUser = null } = userPassport

  const username = loggedInUser ? loggedInUser.username : null
  const { title: courseTitle = '', status: statusFromQuery } = req.query
  const { id: thisId } = req.params
  const courseCodeMaxLength = 7
  const analysisId = thisId.length <= courseCodeMaxLength ? '' : thisId.toUpperCase()
  const courseCode = parseCourseCode(thisId.toUpperCase())

  try {
    const { getCompressedData, renderStaticPage } = getServerSideFunctions()
    const webContext = { lang, proxyPrefixPath: serverConfig.proxyPrefixPath, ...createServerSideContext() }

    /** ------- Setting status ------- */
    const analysisStatus = req.params.preview && req.params.preview === 'preview' ? 'preview' : statusFromQuery
    switch (analysisStatus) {
      case 'p':
        webContext.status = 'published'
        break
      case 'n':
        webContext.status = 'draft'
        break
      default:
        webContext.status = 'draft'
    }
    /* ------- Settings ------- */
    webContext.setBrowserConfig(browserConfig, paths, serverConfig.hostUrl)
    webContext.setLanguage(lang)
    await webContext.setMemberInfo(loggedInUser, courseCode, username)
    if (analysisId) {
      /** ------- Got analysisId  -> request analysis data from api ------- */
      log.debug(' getIndex, get analysis data for : ' + analysisId)
      const kursutvecklingApiResponse = await kursutvecklingAPI.getRoundAnalysisData(analysisId, lang)

      if (kursutvecklingApiResponse.statusCode >= 400) {
        webContext.errorMessage = kursutvecklingApiResponse.statusMessage // TODO: ERROR?????
      } else {
        webContext.analysisId = analysisId
        webContext.analysisData = kursutvecklingApiResponse.body

        const { courseCode: analysisCourseCode } = kursutvecklingApiResponse.body
        webContext.courseCode = analysisCourseCode

        /** ------- Creating title  ------- */
        webContext.setCourseTitle(courseTitle.length > 0 ? decodeURIComponent(courseTitle) : '')
      }
    } else {
      /** ------- Got course code -> prepare for Page 1 depending on status (draft or published) ------- */
      log.debug(' getIndex, get course data for : ' + courseCode)
      const { body, statusCode, statusMessage } = await koppsCourseData.getKoppsCourseData(courseCode, lang)
      if (statusCode && statusCode >= 400) {
        webContext.errorMessage = statusMessage // TODO: ERROR?????
      } else {
        webContext.status = analysisStatus === 'p' ? 'published' : 'new'
        await webContext.handleCourseData(body, courseCode, username, lang)
      }
    }
    log.debug('status set to: ' + webContext.status)

    // /* Course memo for preview */
    log.debug(' get data from kurs-pm-data-api, get kurs-pm data for : ' + courseCode)

    webContext.miniMemosPdfAndWeb = await getSortedAndPrioritizedMiniMemosWebOrPdf(courseCode)
    log.debug('data from kurs-pm-data-api, fetched successfully : ', {
      miniMemosPdfAndWeb: webContext.miniMemosPdfAndWeb,
    })

    const compressedData = getCompressedData(webContext)

    const { uri: proxyPrefix } = serverConfig.proxyPrefixPath

    const view = renderStaticPage({
      applicationStore: {},
      location: req.url,
      basename: proxyPrefix,
      context: webContext,
    })

    return res.render('admin/index', {
      compressedData,
      debug: 'debug' in req.query,
      instrumentationKey: serverConfig.appInsights.instrumentationKey,
      html: view,
      title: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
      lang,
      proxyPrefix,
      description: i18n.messages[lang === 'en' ? 0 : 1].messages.title,
    })
  } catch (err) {
    log.error('Error in getIndex', { error: err })
    return next(err)
  }
}

module.exports = {
  getIndex,
  getRoundAnalysis: _getRoundAnalysis,
  postRoundAnalysis: _postRoundAnalysis,
  deleteRoundAnalysis: _deleteRoundAnalysis,
  getCourseEmployees: _getCourseEmployees,
  getUsedRounds: _getUsedRounds,
  getKoppsCourseData: _getKoppsCourseData,
  saveFileToStorage: _saveFileToStorage,
  updateFileInStorage: _updateFileInStorage,
  getStatisicsForRound: _getStatisicsForRound,
}
