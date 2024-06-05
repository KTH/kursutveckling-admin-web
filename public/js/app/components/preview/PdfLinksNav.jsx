import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { getDateFormat } from '../../util/helpers'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'
import LinkToValidSyllabusPdf from './LinkToValidSyllabus'

const ActiveOrDisabledPdfLink = ({ ariaLabel, href = '', className = '', linkTitle, translate, validFrom = '' }) => {
  const { no_added_doc: labelMissingDoc } = translate
  return (
    <>
      {href === '' ? (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          aria-label={`${ariaLabel}: ${labelMissingDoc}`}
          className={`${className} btn-link disabled`}
          style={{ paddingLeft: 0 }}
        >
          <i>{labelMissingDoc}</i>
        </a>
      ) : (
        <a
          aria-label={`${ariaLabel}${validFrom ? ': ' + validFrom : ''}`}
          href={href}
          className={className}
          target="_blank"
          rel="noreferrer"
        >
          {`${linkTitle}${validFrom ? ': ' + validFrom : ''}`}
        </a>
      )}
    </>
  )
}

function getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds) {
  const _unfilteredRoundsMissingMemos = []
  const tmpMemoNames = {}
  // move rounds without a memo to a separate array
  const roundsWithMemo = analysesLadokRounds.filter(analysesRoundId => {
    const hasMemo = !!thisSemesterMemos[analysesRoundId]
    if (!hasMemo) {
      _unfilteredRoundsMissingMemos.push(analysesRoundId)
      return false
    }
    return true
  })
  // check for duplicates and mark it
  const existingMemosAndDuplicates =
    roundsWithMemo.map(analysesRoundId => {
      const thisRoundMemo = thisSemesterMemos[analysesRoundId]
      const { courseMemoFileName, memoEndPoint, isPdf } = thisRoundMemo
      const memoUniqueId = isPdf ? courseMemoFileName : memoEndPoint
      const uid = memoUniqueId || 'noName'
      if (!tmpMemoNames[uid]) {
        tmpMemoNames[uid] = 'has_memo'
        return { type: 'original', ...thisRoundMemo }
      }
      return { type: 'duplicate', uid, analysesRoundId, isPdf }
    }) || []

  const uniqueMemos = existingMemosAndDuplicates.filter(({ type }) => type !== 'duplicate') || []
  const duplicates = existingMemosAndDuplicates.filter(({ type }) => type === 'duplicate') || []

  // update original memos with ladok round id from a duplicate memo
  duplicates.forEach(({ uid: duplicateMemoFileName, analysesRoundId: roundIdOfDuplicate, isPdf }) => {
    // OBS! Unique condition for ADMIN
    if (isPdf) {
      const indexInOriginal = uniqueMemos.findIndex(
        ({ courseMemoFileName = 'noName', applicationCodes }) =>
          courseMemoFileName === duplicateMemoFileName && !applicationCodes.includes(roundIdOfDuplicate)
      )
      if (indexInOriginal > -1) uniqueMemos[indexInOriginal].applicationCodes.push(roundIdOfDuplicate)
    }
  })

  return [_unfilteredRoundsMissingMemos, uniqueMemos]
}

function parseCourseOffering(applicationCodes, rawSemester, lang = 'sv') {
  const languageIndex = typeof lang === 'string' ? (lang === 'en' ? 0 : 1) : lang

  const { course_short_semester: shortSemLabels } = i18n.messages[languageIndex].messages

  const semester = shortSemLabels[rawSemester.toString().slice(-1)]
  const year = rawSemester.toString().slice(0, 4)

  const offeringIds = applicationCodes.reduce((label, id) => `${label}-${id}`, '')

  const courseOfferings = `${semester} ${year}${offeringIds}`
  return courseOfferings
}

function ParseUploadedMemo({ fileInfo, memoBlobUrl, userLanguageIndex, translate }) {
  const { courseCode, courseMemoFileName, applicationCodes, semester: memoSemester } = fileInfo

  const courseOfferingName = parseCourseOffering(applicationCodes, memoSemester, userLanguageIndex)

  const { label_memo: memoLabel } = translate

  const memoNameWithCourseOfferings = `${memoLabel} ${courseCode} ${courseOfferingName}`

  return (
    <ActiveOrDisabledPdfLink
      ariaLabel={`PDF ${memoNameWithCourseOfferings}`}
      className="pdf-link"
      href={`${memoBlobUrl}${courseMemoFileName}`}
      linkTitle={memoNameWithCourseOfferings}
      translate={translate}
    />
  )
}

function ParseWebMemoName({ courseMemo, hostUrl, translate }) {
  const { courseCode, applicationCodes, memoCommonLangAbbr, semester, memoEndPoint } = courseMemo

  if (!applicationCodes) return null
  const courseOfferingName = parseCourseOffering(applicationCodes, semester, memoCommonLangAbbr)
  const { label_memo: memoLabel } = translate

  const memoNameWithCourseOfferings = `${memoLabel} ${courseCode} ${courseOfferingName}`
  const cleanHostUrl = hostUrl.slice(-1) === '/' ? hostUrl.slice(0, -1) : hostUrl
  return (
    <ActiveOrDisabledPdfLink
      ariaLabel={`${memoNameWithCourseOfferings}`}
      href={`${cleanHostUrl}/kurs-pm/${courseCode}/${memoEndPoint}`}
      linkTitle={memoNameWithCourseOfferings}
      translate={translate}
    />
  )
}

function getRoundsApplicationNames(analysisName, rounds, applicationCodes) {
  const splittedNames = analysisName.split(') ,')
  const splittedApplicationCodes = applicationCodes.split(',')
  const matchingNames = []
  rounds.forEach(applicationCode => {
    const indexOfMatchingApplicationCode = splittedApplicationCodes.indexOf(applicationCode)
    if (splittedNames[indexOfMatchingApplicationCode]) matchingNames.push(splittedNames[indexOfMatchingApplicationCode])
  })

  return matchingNames.join(') , ')
}

function sortMemosByTypes(analysisSemester, context, applicationCodes) {
  const { miniMemosPdfAndWeb } = context

  const analysesLadokRounds = applicationCodes.split(',') || []
  const thisSemesterMemos = miniMemosPdfAndWeb[analysisSemester] || []
  return getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds)
}

function PdfLinksNav(props) {
  const [webContext, setWebContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])
  const { translate, latestAnalysisFileName, staticAnalysisInfo, langIndex } = props
  const { analysisName, courseCode, pdfAnalysisDate, applicationCodes, semester: analysisSemester } = staticAnalysisInfo

  const [unfilteredRoundsMissingMemos, existingMemos] = sortMemosByTypes(analysisSemester, context, applicationCodes)
  const roundsNamesMissingMemos = getRoundsApplicationNames(
    analysisName,
    unfilteredRoundsMissingMemos,
    applicationCodes
  )

  const emptyRounds = unfilteredRoundsMissingMemos || []
  const memos = existingMemos || []

  const { link_memo: linkMemoTexts, link_analysis: linkAnalysisTexts } = translate

  const { storageUri, hostUrl, memoStorageUri } = context.browserConfig

  useEffect(() => {
    // push it to context for alert about missing memo after save/publish on admin start page
    setWebContext({ ...webContext, roundNamesWithMissingMemos: roundsNamesMissingMemos })
  }, [])

  return (
    <span className="right-block-of-links">
      <LinkToValidSyllabusPdf />
      {/* Kurs-PM länkar */}
      <span className="vertical-block-of-links">
        {emptyRounds.map(applicationCode => {
          const missingMemoOfferingName = parseCourseOffering([applicationCode], analysisSemester, langIndex)
          const title = `${linkMemoTexts.label_memo} ${courseCode} ${missingMemoOfferingName}`
          return <ActiveOrDisabledPdfLink ariaLabel={title} key={title} linkTitle={title} translate={linkMemoTexts} />
        })}
        {memos.map((memoInfo, index) => {
          const { isPdf, courseMemoFileName } = memoInfo
          return isPdf || courseMemoFileName ? (
            <ParseUploadedMemo
              key={index}
              translate={linkMemoTexts}
              fileInfo={memoInfo}
              memoBlobUrl={memoStorageUri}
              userLanguageIndex={langIndex}
            />
          ) : (
            <ParseWebMemoName hostUrl={hostUrl} courseMemo={memoInfo} key={index} translate={linkMemoTexts} />
          )
        })}
      </span>
      {/* Kursanalys länk */}

      <ActiveOrDisabledPdfLink
        ariaLabel={`PDF ${linkAnalysisTexts.label_analysis} ${analysisName}`}
        href={`${storageUri}${latestAnalysisFileName}`}
        className="pdf-link"
        linkTitle={`${linkAnalysisTexts.label_analysis}`}
        translate={linkAnalysisTexts}
        validFrom={getDateFormat(pdfAnalysisDate, langIndex)}
      />
    </span>
  )
}

PdfLinksNav.propTypes = {
  langIndex: PropTypes.oneOf([0, 1]).isRequired,
  translate: PropTypes.shape({
    link_analysis: PropTypes.shape({ label_analysis: PropTypes.string, no_added_doc: PropTypes.string }).isRequired,
    link_memo: PropTypes.shape({ label_memo: PropTypes.string, no_added_doc: PropTypes.string }).isRequired,
  }).isRequired,
  thisAnalysisObj: PropTypes.shape({
    analysisName: PropTypes.string,
    courseCode: PropTypes.string,
    pdfAnalysisDate: PropTypes.string,
    syllabusStartTerm: PropTypes.string,
    applicationCodes: PropTypes.string,
    semester: PropTypes.string,
  }),
}

ParseUploadedMemo.propTypes = {
  fileInfo: PropTypes.shape({
    courseCode: PropTypes.string,
    courseMemoFileName: PropTypes.string,
    applicationCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    semester: PropTypes.string,
  }),
  memoBlobUrl: PropTypes.string,
  translate: PropTypes.shape({
    label_memo: PropTypes.string.isRequired,
  }).isRequired,
  userLanguageIndex: PropTypes.oneOf([0, 1]).isRequired,
}

ParseWebMemoName.propTypes = {
  courseMemo: PropTypes.shape({
    courseCode: PropTypes.string.isRequired,
    applicationCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
    memoCommonLangAbbr: PropTypes.oneOf(['en', 'sv']),
    semester: PropTypes.string.isRequired,
    memoName: PropTypes.string,
    memoEndPoint: PropTypes.string,
  }).isRequired,
  hostUrl: PropTypes.string,
  translate: PropTypes.shape({
    label_memo: PropTypes.string.isRequired,
  }).isRequired,
}

export default PdfLinksNav
