import React, { Component } from 'react'
import { SYLLABUS_URL } from '../../util/constants'
import { getDateFormat } from '../../util/helpers'
import LinkToValidSyllabusPdf from './LinkToValidSyllabus'
import { inject, observer } from 'mobx-react'

const ActiveOrDisabledLink = ({ fileName, linkTitle, storageUri, roundName, translate, validFrom }) => {
  const { no_added } = translate
  return (
    <p>
      {fileName === '' ? (
        <a
          aria-label={`PDF ${linkTitle} ${roundName}: ${no_added}`}
          className="pdf-link btn-link disabled"
          key={linkTitle}
        >
          {linkTitle}: {no_added}
        </a>
      ) : (
        <a
          aria-label={`PDF ${linkTitle} ${roundName}: ${validFrom}`}
          href={`${storageUri}${fileName}`}
          className="pdf-link"
          key={linkTitle}
          target="_blank"
        >
          {`${linkTitle}: ${validFrom}`}
        </a>
      )}
    </p>
  )
}

@inject(['routerStore'])
@observer
class PdfLinksNav extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { translate, analysisFile, pmFile, thisAnalysisObj, lang } = this.props
    const { storageUri } = this.props.routerStore.browserConfig

    const {
      // analysisFileName,
      analysisName,
      courseCode,
      pdfAnalysisDate,
      // pmFileName,
      pdfPMDate,
      syllabusStartTerm,
    } = thisAnalysisObj

    return (
      <span className="right-block-of-links">
        <LinkToValidSyllabusPdf startDate={syllabusStartTerm} lang={lang} key={syllabusStartTerm} />
        <ActiveOrDisabledLink
          fileName={pmFile}
          storageUri={storageUri}
          linkTitle={translate.link_pm}
          roundName={analysisName}
          translate={translate}
          validFrom={getDateFormat(pdfPMDate, lang)}
        />
        <ActiveOrDisabledLink
          fileName={analysisFile}
          storageUri={storageUri}
          linkTitle={translate.link_analysis}
          roundName={analysisName}
          translate={translate}
          validFrom={getDateFormat(pdfAnalysisDate, lang)}
        />
      </span>
    )
  }
}

export default PdfLinksNav
