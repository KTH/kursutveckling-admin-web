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
    this.state = { lang: this.props.lang }
  }

  render() {
    const { lang, startDate } = this.state
    const { courseCode, language } = this.props.routerStore
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
}

export default LinkToValidSyllabusPdf
