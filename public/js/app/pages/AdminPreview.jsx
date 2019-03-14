import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'

import i18n from '../../../../i18n'
import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

// Components

@inject(['routerStore']) @observer
class AdminPreview extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave (event) {
    event.preventDefault()
    // const language = this.props.routerStore.courseData.language === 0 ? 'en' : 'sv'
    // window.location = `${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  render ({ routerStore }) {
    return (
      <div key='kursutveckling-preview-container' className='col' id='kursutveckling-preview-container' >
        <p>Oh Yeah.... </p>
      </div>
    )
  }
}

export default AdminPreview
