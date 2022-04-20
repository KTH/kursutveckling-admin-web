import React, { useState } from 'react'
import { Collapse } from 'reactstrap'
import { SYLLABUS_URL } from '../../util/constants'
import i18n from '../../../../../i18n'

function LinkToValidSyllabusPdf(props) {
  const { context: rawContext } = props
  const context = React.useMemo(() => rawContext, [rawContext])

  const [state, setState] = useState({lang: props.lang})

  const { lang, startDate } = state
  const { courseCode, language } = context
  const { course_short_semester, link_syllabus, link_syllabus_empty } = i18n.messages[language].messages

  return (
    <p key={'link-syllabus-from-'}>
      <span className="pdf-link">
        {`${link_syllabus} ${courseCode}: `}
        <i style={{ color: '#000' }}>{link_syllabus_empty}</i>
      </span>
    </p>
  )
}

export default LinkToValidSyllabusPdf
