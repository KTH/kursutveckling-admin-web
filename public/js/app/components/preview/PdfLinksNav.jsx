import React, { useEffect, useReducer } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Alert } from '@kth/kth-reactstrap/dist/components/studinfo'
import { SYLLABUS_URL } from '../../util/constants'
import { getDateFormat } from '../../util/helpers'
import LinkToValidSyllabusPdf from './LinkToValidSyllabus'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'

const paramsReducer = (state, action) => ({ ...state, ...action })

const ActiveOrDisabledPdfLink = ({ ariaLabel, href = '', className = '', linkTitle, translate, validFrom = '' }) => {
  const { no_added_doc } = translate
  return (
    <p key={linkTitle}>
      {href === '' ? (
        <a
          aria-label={`${ariaLabel}: ${no_added_doc}`}
          className={`${className} btn-link disabled`}
          style={{ paddingLeft: 0 }}
        >
          <i>{no_added_doc}</i>
        </a>
      ) : (
        <a
          aria-label={`${ariaLabel}${validFrom ? ': ' + validFrom : ''}`}
          href={href}
          className={className}
          target="_blank"
        >
          {`${linkTitle}${validFrom ? ': ' + validFrom : ''}`}
        </a>
      )}
    </p>
  )
}

function parseCourseOffering(ladokRoundIds, rawSemester, lang = 'sv') {
  const languageIndex = typeof lang === 'string' ? (lang === 'en' ? 0 : 1) : lang

  const { course_short_semester: shortSemLabels, link_memo: linkMemoTexts } = i18n.messages[languageIndex].messages

  const { label_memo: memoLabel } = linkMemoTexts

  const semester = shortSemLabels[rawSemester.toString().slice(-1)]
  const year = rawSemester.toString().slice(0, 4)

  const offeringIds = ladokRoundIds.reduce((label, id) => `${label}-${id}`, '')

  const courseOfferings = `${semester} ${year}${offeringIds}`
  return courseOfferings
}

function ParseUploadedMemo({ fileInfo, memoBlobUrl, userLanguageIndex, translate }) {
  const { courseCode, courseMemoFileName, ladokRoundIds, semester: memoSemester } = fileInfo

  const courseOfferingName = parseCourseOffering(ladokRoundIds, memoSemester, userLanguageIndex)

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
  const { courseCode, ladokRoundIds, memoCommonLangAbbr, semester, memoName: courseOffering, memoEndPoint } = courseMemo

  if (!ladokRoundIds) return null
  const courseOfferingName = parseCourseOffering(ladokRoundIds, semester, memoCommonLangAbbr)
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

function renderAlertToTop(langIndex, roundsWithoutMemo) {
  const alertContainer = document.getElementById('alert-placeholder')
  const { alert_no_course_memo_header: alertTitle, alert_no_course_memo_info: description } =
    i18n.messages[langIndex].messages
  if (alertContainer) {
    ReactDOM.render(
      <Alert type="info" className="alert-margin">
        <h5>{alertTitle}</h5>
        <p>{`${
          langIndex === 0
            ? 'The following course offerings which are included in your course analysis do not have a course PM:'
            : 'Följande kurstillfällen som du valt för din kursanalys saknar kurs-PM:'
        } ${roundsWithoutMemo}`}</p>
        <p>{description}</p>
      </Alert>,
      alertContainer
    )
  }
}
function PdfLinksNav(props) {
  const { context: rawContext } = props
  const context = React.useMemo(() => rawContext, [rawContext])
  const [state, setState] = useReducer(paramsReducer, {
    emptyRoundsNames: '',
    emptyRounds: [],
    memos: [],
  })

  useEffect(() => {
    const { langIndex, staticAnalysisInfo } = props
    const [unfilteredRoundsMissingMemos, existingMemos] = sortMemosByTypes()
    const roundsNamesMissingMemos = getRoundsNames(unfilteredRoundsMissingMemos)

    setState({
      emptyRoundsNames: roundsNamesMissingMemos,
      emptyRounds: unfilteredRoundsMissingMemos,
      memos: existingMemos,
    })
    // push it to context for alert about missing memo after save/publish on admin start page
    context.roundNamesWithMissingMemos = roundsNamesMissingMemos

    if (unfilteredRoundsMissingMemos.length > 0) {
      renderAlertToTop(langIndex, roundsNamesMissingMemos)
    }
  }, [])

  function getRoundsNames(rounds) {
    const { analysisName, roundIdList } = props.staticAnalysisInfo
    const splittedNames = analysisName.split(') ,')
    const splittedRoundIds = roundIdList.split(',')
    const matchingNames = []
    rounds.forEach(roundId => {
      const indexOfMatchingRound = splittedRoundIds.indexOf(roundId)
      if (splittedNames[indexOfMatchingRound]) matchingNames.push(splittedNames[indexOfMatchingRound])
    })

    return matchingNames.join(') , ')
  }
  function getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds) {
    const unfilteredRoundsMissingMemos = []
    const tmpMemoNames = {}
    // move rounds without a memo to a separate array
    const roundsWithMemo = analysesLadokRounds.filter(analysesRoundId => {
      const hasMemo = !!thisSemesterMemos[analysesRoundId]
      if (!hasMemo) {
        unfilteredRoundsMissingMemos.push(analysesRoundId)
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
        const uid = memoUniqueId ? memoUniqueId : 'noName'
        if (!tmpMemoNames[uid]) {
          tmpMemoNames[uid] = 'has_memo'
          return { type: 'original', ...thisRoundMemo }
        } else return { type: 'duplicate', uid, analysesRoundId, isPdf }
      }) || []

    const uniqueMemos = existingMemosAndDuplicates.filter(({ type }) => type !== 'duplicate') || []
    const duplicates = existingMemosAndDuplicates.filter(({ type }) => type === 'duplicate') || []

    // update original memos with ladok round id from a duplicate memo
    duplicates.forEach(({ uid: duplicateMemoFileName, analysesRoundId: roundIdOfDuplicate, isPdf }) => {
      // OBS! Unique condition for ADMIN
      if (isPdf) {
        const indexInOriginal = uniqueMemos.findIndex(
          ({ isPdf, courseMemoFileName = 'noName', ladokRoundIds }) =>
            courseMemoFileName === duplicateMemoFileName && !ladokRoundIds.includes(roundIdOfDuplicate)
        )
        if (indexInOriginal > -1) uniqueMemos[indexInOriginal].ladokRoundIds.push(roundIdOfDuplicate)
      }
    })

    return [unfilteredRoundsMissingMemos, uniqueMemos]
  }
  function sortMemosByTypes() {
    const { miniMemosPdfAndWeb } = context
    const { staticAnalysisInfo } = props

    const { roundIdList, semester: analysisSemester } = staticAnalysisInfo

    const analysesLadokRounds = roundIdList.split(',') || []
    const thisSemesterMemos = miniMemosPdfAndWeb[analysisSemester] || []
    return getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds)
  }
  const { translate, latestAnalysisFileName, staticAnalysisInfo, langIndex } = props
  const { link_memo: linkMemoTexts, link_analysis: linkAnalysisTexts } = translate

  const { storageUri, hostUrl, memoStorageUri } = context.browserConfig

  const {
    analysisName,
    courseCode,
    pdfAnalysisDate,
    syllabusStartTerm,
    semester: analysisSemester,
  } = staticAnalysisInfo
  return (
    <span className="right-block-of-links">
      <LinkToValidSyllabusPdf startDate={syllabusStartTerm} lang={langIndex} key={syllabusStartTerm} />
      {/* Kurs-PM länkar */}
      <span className="vertical-block-of-links">
        {state.emptyRounds.map(ladokRoundId => {
          const missingMemoOfferingName = parseCourseOffering([ladokRoundId], analysisSemester, langIndex)
          const title = `${linkMemoTexts.label_memo} ${courseCode} ${missingMemoOfferingName}`
          return <ActiveOrDisabledPdfLink ariaLabel={title} key={title} linkTitle={title} translate={linkMemoTexts} />
        })}
        {state.memos.map((memoInfo, index) => {
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
    roundIdList: PropTypes.string,
    semester: PropTypes.string,
  }),
}

ParseUploadedMemo.propTypes = {
  fileInfo: PropTypes.shape({
    courseCode: PropTypes.string,
    courseMemoFileName: PropTypes.string,
    ladokRoundIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    ladokRoundIds: PropTypes.arrayOf(PropTypes.string).isRequired,
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
