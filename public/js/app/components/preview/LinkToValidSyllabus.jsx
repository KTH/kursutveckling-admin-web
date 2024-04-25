import React from 'react'
import i18n from '../../../../../i18n'
import { useWebContext } from '../../context/WebContext'

function LinkToValidSyllabusPdf() {
  const [webContext] = useWebContext()
  const context = React.useMemo(() => webContext, [webContext])

  const { courseCode, language } = context
  const { link_syllabus, link_syllabus_empty } = i18n.messages[language].messages

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
