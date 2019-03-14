import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'

import i18n from '../../../../i18n'
import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

// Components
// import CourseKeyInformationOneCol from "../components/CourseKeyInformationOneCol.jsx"

@inject(['routerStore']) @observer
class AdminForm extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    this.openPreview = this.openPreview.bind(this)
  }

  openPreview (event) {
    event.preventDefault()
    // const language = this.props.routerStore.courseData.language === 0 ? 'en' : 'sv'
    // window.location = `${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  render ({routerStore}) {
    console.log(routerStore)
    return (
      <div key='kursutveckling-form-container' className='col' id='kursutveckling-form-container' >
        <p>Oh Yeah.... form... </p>
      </div>
    )
  }
}

export default AdminForm
