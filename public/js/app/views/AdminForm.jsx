import { Component } from 'inferno'
import { inject, observer } from 'inferno-mobx'

import Alert from 'inferno-bootstrap/dist/Alert'
import Button from 'inferno-bootstrap/lib/Button'
import Col from 'inferno-bootstrap/dist/Col'
import Row from 'inferno-bootstrap/dist/Row'
import Form from 'inferno-bootstrap/lib/Form/Form'
import Input from 'inferno-bootstrap/lib/Form/Input'
import Label from 'inferno-bootstrap/lib/Form/Label'

import i18n from '../../../../i18n'
import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

// Components
// import CourseKeyInformationOneCol from "../components/CourseKeyInformationOneCol.jsx"

@inject(['routerStore']) @observer
class AdminForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      values: this.props.routerStore.roundData,
      saved: false
        /* values.courseCode: this.props.routerStore.roundData.courseCode,
      commentEn: this.props.routerStore.roundData.comment_en,
      commentSv: this.props.routerStore.roundData.comment_sv*/
    }
    this.openPreview = this.openPreview.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handleSave.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  openPreview (event) {
    event.preventDefault()
    // const language = this.props.routerStore.courseData.language === 0 ? 'en' : 'sv'
    // window.location = `${ADMIN_URL}${this.props.routerStore.courseData.courseInfo.course_code}?l=${language}`
  }

  handleSave (event) {
    event.preventDefault()
    const postObject = this.state.values
    const thisInstance = this
    console.log('postObject', postObject)
    return this.props.routerStore.postRoundAnalysisData(postObject)
   .then((data) => {
     thisInstance.setState({
       values: data,
       saved: true
     })
   })
  }

  handlePublish (event) {
    event.preventDefault()
    const postObject = this.state.values
    postObject.isPublished = true
    const thisInstance = this
    console.log('postObject', postObject)
    return this.props.routerStore.postRoundAnalysisData(postObject)
   .then((data) => {
     thisInstance.setState({
       values: data,
       saved: true
     })
   })
  }

  handleInputChange (event) {
    // event.bubbles = false
    let values = this.state.values
    values[event.target.id] = event.target.value
    this.setState({
      values: values,
      saved: false
    })
  }

  render ({routerStore}) {
    console.log(routerStore, this.state.values)
    return (
      <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' >
      <br /><br /><br />
        <Row key='preview' id='preview-container'>

        <Col sm='3' className='col-temp'>
          <h4>ID </h4>
              <p id='id' key='id' >{this.state.values.id}</p>
              <h4>course code </h4>
              <p id='courseCode' key='courseCode'>{this.state.values.courseCode}</p>
              <h4>round name </h4>
              <p id='round' key='round' >{this.state.values.round}</p>
              </Col>
            <Col sm='3' className='col-temp'>
              <h4>programmes </h4>
              <p id='programmeCodes' key='programmeCodes' >{this.state.values.programmeCodes} </p>
              <h4>examiners </h4>
              <p id='examiners' key='examiners' >{this.state.values.examiners}</p>
              <h4>responsibles </h4>
              <p id='responsibles' key='responsibles' >{this.state.values.responsibles}</p>
            </Col>
            <Col sm='3' className='col-temp' >
            <h4>examinationRounds </h4>
              <p id='examinationRounds' key='examinationRounds' >{this.state.values.examinationRounds}</p>
              <h4>registered students </h4>
              <p id='registeredStudents' key='registeredStudents' >{this.state.values.registeredStudents}</p>
              <h4>examination grade </h4>
              <p id='examinationGrade' key='examinationGrade' >{this.state.values.examinationGrade} </p>
            </Col>
            <Col sm='3' className='col-temp'>
              <h4>alteration text </h4>
              <p id='alterationText' key='alterationText' >{this.state.values.alterationText}</p>
              <h4>commentChange </h4>
              <p id='commentChange' key='commentChange' >{this.state.values.commentChange}</p>
              <h4>commentExam </h4>
              <p id='commentExam' key='commentExam' >{this.state.values.commentExam}</p>
              </Col>
              <Button id='Save' key='Save' onClick={this.handlePublish}>Publish</Button>

        </Row>
        <br />
        <p>--------------------------------------------------------------------------------------------------------------------------</p>
        <br />
        <Row key='form' id='form-container'>

          <Col>
          {this.state.saved ?
             <Alert>
              Finimangsparat
              </Alert>
            : ''}
             <Label>ID</Label>
            <Input id='id' key='id' type='text' value={this.state.values.id} onInput={this.handleInputChange} />
            <Label>course code</Label>
            <Input id='courseCode' key='courseCode' type='text' value={this.state.values.courseCode} onInput={this.handleInputChange} />


            <Form>
              Test data...<br />
              <Label>round name</Label>
              <Input id='round' key='round' type='text' value={this.state.values.round} onInput={this.handleInputChange} />
              <Label>Programmes</Label>
              <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onInput={this.handleInputChange} />
              <Label>examiners</Label>
              <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onInput={this.handleInputChange} />
              <Label>responsibles</Label>
              <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onInput={this.handleInputChange} />
              <Label>examinationRounds</Label>
              <Input id='examinationRounds' key='examinationRounds' type='text' value={this.state.values.examinationRounds} onInput={this.handleInputChange} />
              <Label>registered students</Label>
              <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onInput={this.handleInputChange} />
              <Label>examination grade</Label>
              <Input id='examinationGrade' key='examinationGrade' type='text' value={this.state.values.examinationGrade} onInput={this.handleInputChange} />

              <Label>alteration text</Label>
              <Input id='alterationText' key='alterationText' type='text' value={this.state.values.alterationText} onInput={this.handleInputChange} />
              <Label>commentChange</Label>
              <Input id='commentChange' key='commentChange' type='text' value={this.state.values.commentChange} onInput={this.handleInputChange} />
              <Label>commentExam</Label>
              <Input id='commentExam' key='commentExam' type='text' value={this.state.values.commentExam} onInput={this.handleInputChange} />
              <Button id='Save' key='Save' onClick={this.handleSave}>Save</Button>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}

const inputCreater = ({label, id, value, intance}) => {
  return (
      <div>
        <Label>{label}</Label>
        <Input type='text' id={id} key={id} value={intance.state.values[id]} onInput={intance.handleInputChange} />
      </div>
    )
}

export default AdminForm
