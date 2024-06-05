import React, { useReducer } from 'react'
// Helpers
import i18n from '../../../../i18n/index'
// Custom components
import Alert from '../components-shared/Alert'
import { useWebContext } from '../context/WebContext'

import TableWithCourseData from './preview/TableWithCourseData'
import Details from './preview/Details'
import PdfLinksNav from './preview/PdfLinksNav'

const paramsReducer = (state, action) => ({ ...state, ...action })

function Preview(props) {
  const [webContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])
  const { analysisFile: latestAnalysisFileName, values } = props

  const [state] = useReducer(paramsReducer, {
    isPublished: context.roundAnalysis === 'published',
    isNew: context.roundAnalysis === 'new',
    values,
  })

  const { language: langIndex } = context
  const translate = i18n.messages[langIndex].messages
  const courseRoundObj = state.values
  const { analysisName, _id: courseAnalysDataId } = courseRoundObj

  if (context.analysisData === undefined) return <div>A message here of some kind...</div>

  return (
    <div key="kursutveckling-andmin-preview" className="list-section-per-year col" id="preview-container">
      <h2>{translate.header_preview_content}</h2>
      <p>{context.status === 'preview' ? '' : translate.intro_preview}</p>
      {/* If memo is missing a memo place an alert */}
      <div id="alert-placeholder" />
      {context.analysisData.examinationRounds && context.analysisData.examinationRounds.length === 0 ? (
        <Alert type="warning">Something got wrong</Alert>
      ) : (
        <section
          className="course-data-for-round list-section-per-year"
          aria-describedby={'h3' + courseAnalysDataId}
          key={'section-for-analys-' + courseAnalysDataId}
        >
          <h3 id={'h3' + courseAnalysDataId}>{analysisName}</h3>
          <PdfLinksNav
            latestAnalysisFileName={latestAnalysisFileName}
            langIndex={langIndex}
            translate={translate}
            staticAnalysisInfo={courseRoundObj}
          />

          <TableWithCourseData
            translate={translate.table_headers_with_popup}
            thisAnalysisObj={courseRoundObj}
            language={langIndex}
          />
          <div>
            <p className="float-right">{translate.info_manually_edited}</p>
          </div>
          <Details thisAnalysisObj={courseRoundObj} translate={translate} />
        </section>
      )}
    </div>
  )
}

export default Preview
