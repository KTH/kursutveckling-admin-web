import React from 'react'
//import { SYLLABUS_URL } from '../util/constants'

import { getDateFormat, formatDate } from '../../util/helpers'

const ActiveOrDisavledLink = ({href, linkTitle, validFrom, language}) => {
  return (
    <p>
        {href === '#'
        ? <a className='pdf-link' key={linkTitle}>
            {linkTitle}: -
        </a>
        : <a href={href} className='pdf-link' key={linkTitle} target='_blank'>
            {linkTitle} {validFrom.length > 0 ? ': '+ getDateFormat(validFrom, language) : '' }
        </a>}
    </p>
    )
}

const SyllabusPmAnalysLinks = ({translate, courseRoundObj, storageUri, analysisFile, pmFile, language }) => {
  const { pdfAnalysisDate, pdfPMDate } = courseRoundObj
  const analysisLink = analysisFile  !== '' ? storageUri + analysisFile  : '#'
  const pmLink = pmFile  !== '' ? storageUri + pmFile  : '#'
  //const syllabusHref = syllabusStartTerm ? `${SYLLABUS_URL}${koppsData.course_code}-${syllabusStartTerm}` : '#'
  //const syllabusPublishedDate = syllabusStartTerm ? `${translate.course_short_semester[syllabusStartTerm.toString().substring(4, 5)]} ${syllabusStartTerm.toString().substring(0, 4)}` : ''

  return (
    <span className='right-links' >
      <p className='pdf-link'>{translate.link_syllabus}: {translate.link_syllabus_empty}</p>
      <ActiveOrDisavledLink 
        href={pmLink} 
        linkTitle={translate.link_pm}  
        alt={translate.alt_link_pm} 
        validFrom={pdfPMDate}
        language ={language}
      />
      <ActiveOrDisavledLink 
        href={analysisLink} 
        linkTitle={translate.link_analysis}   
        alt={translate.alt_link_analysis} 
        validFrom={pdfAnalysisDate} 
        language ={language}
      />
    </span>
    )
}

export default SyllabusPmAnalysLinks