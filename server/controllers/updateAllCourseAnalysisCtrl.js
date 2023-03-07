'use strict'

const log = require('@kth/log')
const { getAllCourseAnalysis, updateRoundAnalysisData } = require('../apiCalls/kursutvecklingAPI')
const { getKoppsCourseData } = require('../apiCalls/koppsCourseData')

function _getAllUniqueCourseCodesFromData(data) {
  const courseCodes = []
  data.forEach(({ courseCode }) => {
    const isCourseCodeAlreadyExist = courseCodes.some(x => x === courseCode)
    if (!isCourseCodeAlreadyExist) {
      courseCodes.push(courseCode)
    }
  })
  return courseCodes
}

async function _getCourseRoundTermMap(courseCodes) {
  const courseRoundTermMap = new Map()
  for await (const courseCode of courseCodes) {
    log.info('Fetching course round terms for course: ', courseCode)
    const { body } = await getKoppsCourseData(courseCode)
    if (body) {
      const { termsWithCourseRounds } = body
      if (termsWithCourseRounds && termsWithCourseRounds.length > 0) {
        courseRoundTermMap.set(courseCode, termsWithCourseRounds)
      }
    }
  }
  log.info('Total courses to fetch course rounds', courseCodes.length)
  log.info('Total terms found in Kopps', courseRoundTermMap.size)
  return courseRoundTermMap
}

async function _updateAllCourseAnalysis() {
  const analysisExportMap = {}
  const failedAnalysisToUpdate = []
  const analysisUpdated = []
  const analysisWithOutApplicationCodes = []
  const { body: analysisData } = await getAllCourseAnalysis()
  if (analysisData && analysisData.length > 0) {
    const courseCodes = _getAllUniqueCourseCodesFromData(analysisData)
    if (courseCodes && courseCodes.length > 0) {
      try {
        const courseRoundTermsMap = await _getCourseRoundTermMap(courseCodes)
        for await (const analysis of analysisData) {
          const { courseCode, semester, _id, roundIdList } = analysis
          const lastTermsInfo = courseRoundTermsMap.get(courseCode)
          if (lastTermsInfo) {
            const lastTermInfo = lastTermsInfo.find(x => x.term.toString() === semester.toString())
            if (lastTermInfo) {
              const { rounds } = lastTermInfo
              for await (const ladokRoundId of roundIdList.split(',')) {
                const round = rounds.find(x => x.ladokRoundId.toString() === ladokRoundId.toString())
                if (round) {
                  const { applicationCode: application_code } = round
                  if (application_code && application_code !== '') {
                    if (analysis.applicationCodes && analysis.applicationCodes !== '') {
                      const applicationCodeList = analysis.applicationCodes.split(',')
                      const applicationCode = applicationCodeList.find(
                        x => x.toString() === application_code.toString()
                      )
                      if (!applicationCode) {
                        log.info('Applition code pushed to analysis: ', { application_code }, analysis)
                        analysis.applicationCodes += ',' + application_code
                      } else {
                        log.debug('Application Code already exist in analysis', { applicationCode })
                      }
                    } else {
                      log.info('Application code set to analysis: ', { application_code }, analysis)
                      analysis.applicationCodes = application_code
                    }
                  } else {
                    log.debug('Application code is empty from Kopps for ', analysis, { application_code })
                    analysisWithOutApplicationCodes.push(analysis)
                  }
                } else {
                  log.debug('No round matched', { ladokRoundId })
                  analysisWithOutApplicationCodes.push(analysis)
                }
              }
              try {
                const apiResponse = await updateRoundAnalysisData(_id, analysis)
                if (apiResponse.message) {
                  log.info('Error from API trying to update analysis: ', apiResponse.message)
                  failedAnalysisToUpdate.push(analysis)
                } else {
                  analysisUpdated.push(analysis)
                  log.info('Analysis Updated successfully with _id: ', _id)
                }
              } catch (error) {
                log.error('Error in updating analysis : ', error)
                failedAnalysisToUpdate.push(analysis)
              }
            } else {
              log.debug('Last term info not found for analysis: ', analysis)
              analysisWithOutApplicationCodes.push(analysis)
            }
          } else {
            log.debug('Terms not found for analysis : ', analysis)
            analysisWithOutApplicationCodes.push(analysis)
          }
        }
      } catch (error) {
        log.error('Error in preparing analysis object with application code', error)
      }
    } else {
      log.debug('No course codes found from analysis')
    }
  } else {
    log.debug('No analysis fetched')
  }
  log.info('Total fetced analysis', analysisData.length)
  log.info('Total analysis updated', analysisUpdated.length)
  log.info('Total failed analysis', failedAnalysisToUpdate.length)
  log.info('Total analysis without application codes', analysisWithOutApplicationCodes.length)
  if (failedAnalysisToUpdate.length > 0) {
    analysisExportMap['failed_analysis.csv'] = failedAnalysisToUpdate
  }
  if (analysisWithOutApplicationCodes.length > 0) {
    analysisExportMap['analysis_with_out_application_codes.csv'] = analysisWithOutApplicationCodes
  }
  return analysisExportMap
}

module.exports = {
  updateAllCourseAnalysis: _updateAllCourseAnalysis,
}
