import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import PropTypes from 'prop-types'
import { Alert } from '@kth/kth-reactstrap/dist/components/studinfo'

import { SYLLABUS_URL } from '../../util/constants'
import { getDateFormat } from '../../util/helpers'
import LinkToValidSyllabusPdf from './LinkToValidSyllabus'
import { inject, observer } from 'mobx-react'
import i18n from '../../../../../i18n'

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

function resolveMemoBlobUrl() {
  const devMemoStorageUrl = 'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/'
  const prodMemoStorageUrl = 'https://kursinfostorageprod.blob.core.windows.net/memo-blob-container/'
  const memoStorageUrl = process.env.MEMO_STORAGE_URL
  if (memoStorageUrl) {
    return memoStorageUrl
  }
  const nodeEnv = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase()
  if (nodeEnv === 'development' || nodeEnv === 'test' || nodeEnv === 'dev' || !nodeEnv) {
    return devMemoStorageUrl
  }
  return prodMemoStorageUrl
}

function parseCourseOffering(ladokRoundIds, rawSemester, lang) {
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

function ParseWebMemoName({ courseMemo, translate }) {
  const { courseCode, ladokRoundIds, memoCommonLangAbbr, semester, memoName: courseOffering, memoEndPoint } = courseMemo

  if (!ladokRoundIds) return null
  const courseOfferingName = parseCourseOffering(ladokRoundIds, semester, memoCommonLangAbbr)
  const { label_memo: memoLabel } = translate

  const memoNameWithCourseOfferings = `${memoLabel} ${courseCode} ${courseOfferingName}`

  return (
    <ActiveOrDisabledPdfLink
      ariaLabel={`${memoNameWithCourseOfferings}`}
      href={`kurs-pm/${courseCode}/${memoEndPoint}`}
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
      <Alert type="info" className="margin-bottom-40">
        <h5>{alertTitle}</h5>
        <p>{description}</p>
        <p>{`${
          langIndex === 0 ? 'Rounds without memo:' : 'Kurstillfälle som saknar kurs-PM:'
        } ${roundsWithoutMemo}`}</p>
      </Alert>,
      alertContainer
    )
  }
}

@inject(['routerStore'])
@observer
class PdfLinksNav extends Component {
  constructor(props) {
    super(props)
    this.state = { emptyRoundsNames: '', emptyRounds: [], memos: [] }
    this.getMemoLinksInfo = this.getMemoLinksInfo.bind(this)
    this.getRoundsNames = this.getRoundsNames.bind(this)
    this.sortMemosByTypes = this.sortMemosByTypes.bind(this)
  }

  componentDidMount() {
    const { langIndex, staticAnalysisInfo } = this.props

    const [unfilteredRoundsMissingMemos, existingMemos] = this.sortMemosByTypes()

    const roundsNamesMissingMemos = this.getRoundsNames(unfilteredRoundsMissingMemos)

    this.setState({
      emptyRoundsNames: roundsNamesMissingMemos,
      emptyRounds: unfilteredRoundsMissingMemos,
      memos: existingMemos,
    })

    if (unfilteredRoundsMissingMemos.length > 0) {
      renderAlertToTop(langIndex, roundsNamesMissingMemos)
    }
  }

  getRoundsNames(rounds) {
    const { analysisName, roundIdList } = this.props.staticAnalysisInfo
    const splittedNames = analysisName.split(') ,')
    const splittedRoundIds = roundIdList.split(',')
    const matchingNames = []
    rounds.forEach(roundId => {
      const indexOfMatchingRound = splittedRoundIds.indexOf(roundId)
      if (splittedNames[indexOfMatchingRound]) matchingNames.push(splittedNames[indexOfMatchingRound])
    })

    return matchingNames.join(') , ')
  }

  getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds) {
    const unfilteredRoundsMissingMemos = []
    const roundsWithMemo = analysesLadokRounds.filter(analysesRoundId => {
      const hasMemo = !!thisSemesterMemos[analysesRoundId]
      if (!hasMemo) {
        unfilteredRoundsMissingMemos.push(analysesRoundId)
        return false
      }
      return true
    })
    const existingMemos =
      roundsWithMemo.map(analysesRoundId => {
        const thisRoundMemo = thisSemesterMemos[analysesRoundId]
        const { courseMemoFileName, memoEndPoint, isPdf } = thisRoundMemo
        const memoUniqueId = isPdf ? courseMemoFileName : memoEndPoint
        return {
          [memoUniqueId ? memoUniqueId : 'noName']: thisRoundMemo,
        }
      }) || []

    return [unfilteredRoundsMissingMemos, existingMemos]
  }

  sortMemosByTypes() {
    const { miniMemosPdfAndWeb } = this.props.routerStore
    const { staticAnalysisInfo } = this.props

    const { roundIdList, semester: analysisSemester } = staticAnalysisInfo

    const analysesLadokRounds = roundIdList.split(',') || []
    const thisSemesterMemos = miniMemosPdfAndWeb[analysisSemester] || []
    return this.getMemoLinksInfo(thisSemesterMemos, analysesLadokRounds)
  }

  render() {
    const { translate, latestAnalysisFileName, staticAnalysisInfo, langIndex } = this.props
    const { link_memo: linkMemoTexts, link_analysis: linkAnalysisTexts } = translate

    const { storageUri } = this.props.routerStore.browserConfig
    const memoStorageUrl = resolveMemoBlobUrl() //move to domain or settings

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
          {this.state.emptyRounds.map(ladokRoundId => {
            const missingMemoOfferingName = parseCourseOffering([ladokRoundId], analysisSemester, langIndex)
            const title = `${linkMemoTexts.label_memo} ${courseCode} ${missingMemoOfferingName}`
            return <ActiveOrDisabledPdfLink ariaLabel={title} key={title} linkTitle={title} translate={linkMemoTexts} />
          })}
          {this.state.memos.map((memo, index) => {
            const memoInfo = Object.values(memo)[0]
            const { isPdf, courseMemoFileName } = memoInfo
            return isPdf || courseMemoFileName ? (
              <ParseUploadedMemo
                key={index}
                translate={linkMemoTexts}
                fileInfo={memoInfo}
                memoBlobUrl={memoStorageUrl}
                userLanguageIndex={langIndex}
                translate={linkMemoTexts}
              />
            ) : (
              <ParseWebMemoName courseMemo={memoInfo} key={index} translate={linkMemoTexts} />
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
  translate: PropTypes.shape({
    label_memo: PropTypes.string.isRequired,
  }).isRequired,
}

export default PdfLinksNav
