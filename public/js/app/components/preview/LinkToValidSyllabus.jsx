import React, { Component } from 'react'
import { Collapse } from 'reactstrap'
import { SYLLABUS_URL } from '../../util/constants'
import { inject, observer } from 'mobx-react'
import i18n from '../../../../../i18n'

@inject(['routerStore'])
@observer
class LinkToValidSyllabusPdf extends Component {
  constructor(props) {
    super(props)
    this.state = { startDate: this.props.startDate, lang: this.props.lang }
  }

  render() {
    const { lang, startDate } = this.state
    const { courseCode, language } = this.props.routerStore
    const { course_short_semester, link_syllabus, link_syllabus_empty } = i18n.messages[language].messages
    const startTermName = `${course_short_semester[startDate.substring(4, 5)]}${startDate.substring(0, 4)}`
    const coursePlanLabel = `${link_syllabus} ${courseCode} ( ${startTermName} -  )`

    return (
      <p key={'link-syllabus-from-' + startDate}>
        <a
          aria-label={`PDF ${coursePlanLabel}`}
          href={`${SYLLABUS_URL}${courseCode}-${startDate}.pdf?lang=${lang}`}
          target="_blank"
          className="pdf-link"
        >
          {coursePlanLabel}
        </a>
      </p>
    )
  }
}

export default LinkToValidSyllabusPdf
