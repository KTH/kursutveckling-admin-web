import React, { useReducer } from 'react'
import { Alert, Table } from 'reactstrap'

// Custom components
import TableWithCourseData from './preview/TableWithCourseData'
import Details from './preview/Details'
import PdfLinksNav from './preview/PdfLinksNav'
import { useWebContext } from '../context/WebContext'

//Helpers
import i18n from '../../../../i18n/index'
import { useHistory } from 'react-router'

const paramsReducer = (state, action) => ({ ...state, ...action })

function Preview(props) {
  const [webContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])

  const [state, setState] = useReducer(paramsReducer, {
    isPublished: context.roundAnalysis === 'published',
    isNew: context.roundAnalysis === 'new',
    values: props.values,
  })

  const { analysisFile: latestAnalysisFileName } = props
  const { language: langIndex } = context
  const translate = i18n.messages[langIndex].messages
  const courseRoundObj = state.values
  const { analysisName, _id: courseAnalysDataId } = courseRoundObj
  const headerId = 'header-year'

  if (context.analysisData === undefined) return <div>A message here of some kind...</div>

  return (
    <div key="kursutveckling-andmin-preview" className="list-section-per-year col" id="preview-container">
      <h2>{translate.header_preview_content}</h2>
      <p>{context.status === 'preview' ? '' : translate.intro_preview}</p>
      <p>{translate.info_manually_edited}</p>
      {/* If memo is missing a memo place an alert */}
      <div id="alert-placeholder" />
      {context.analysisData.examinationRounds && context.analysisData.examinationRounds.length === 0 ? (
        <Alert className="alert-margin">Something got wrong</Alert>
      ) : (
        <section
          className="course-data-for-round"
          aria-describedby={'h3' + courseAnalysDataId}
          key={'section-for-analys-' + courseAnalysDataId}
        >
          {/* {index === 0 && <h2 id={headerId}>{year}</h2>} */}
          <div className="h3-and-link">
            <h3 id={'h3' + courseAnalysDataId}>{analysisName}</h3>
          </div>
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

          <Details label={'moreData' + courseRoundObj._id} thisAnalysisObj={courseRoundObj} translate={translate} />
        </section>
      )}
    </div>
  )
}

export default Preview
