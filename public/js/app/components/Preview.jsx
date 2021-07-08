import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Table } from 'reactstrap'

// Custom components
import TableWithCourseData from './preview/TableWithCourseData'
import Details from './preview/Details'
import PdfLinksNav from './preview/PdfLinksNav'

//Helpers
import i18n from '../../../../i18n/index'

@inject(['routerStore'])
@observer
class Preview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPublished: this.props.routerStore.roundAnalysis === 'published',
      isNew: this.props.routerStore.roundAnalysis === 'new',
      values: this.props.values,
    }
  }

  render() {
    const { routerStore, analysisFile: latestAnalysisFileName } = this.props
    const { language: langIndex } = routerStore
    const translate = i18n.messages[langIndex].messages
    const courseRoundObj = this.state.values
    const { analysisName, _id: courseAnalysDataId } = courseRoundObj
    const headerId = 'header-year'

    if (routerStore.analysisData === undefined) return <div>A message here of some kind...</div>
    return (
      <div key="kursutveckling-andmin-preview" className="list-section-per-year col" id="preview-container">
        <h2>{translate.header_preview_content}</h2>
        <p>{routerStore.status === 'preview' ? '' : translate.intro_preview}</p>
        <p>{translate.info_manually_edited}</p>
        {routerStore.analysisData.examinationRounds && routerStore.analysisData.examinationRounds.length === 0 ? (
          <Alert className="margin-bottom-40">Something got wrong</Alert>
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
}

export default Preview
