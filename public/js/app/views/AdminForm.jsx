import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert} from 'reactstrap'
/*import Alert from 'reactstrap/Alert'
import { Button } from 'reactstrap'
import Col from 'reactstrap/Col'
import Row from 'reactstrap/Row'
import Form from 'reactstrap/Form'*/

//import i18n from '../../../../i18n'
//import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

@inject(['routerStore']) @observer
class AdminForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      saved: false,
      values: this.props.routerStore.roundData
     /* commentEn: this.props.routerStore.roundData.comment_en,
      commentSv: this.props.routerStore.roundData.comment_sv*/
    }
    this.openPreview = this.openPreview.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handleSave.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  openPreview (event) {
    event.preventDefault()
  }

  /*componentWillMount(){ 
    const id = this.props.routerStore.analysisId
    console.log("mount", id)
   this.props.routerStore.getRoundAnalysis(id, 'sv')
   .then((data) => { console.log("mount2", data)
     thisInstance.setState({
       values: data
     })
   })
  }*/

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

  render () {
    const routerStore = this.props.routerStore
    const isDisabled = this.state.values.isPublished
    console.log("routerStore, this.state.values", routerStore)
    if(routerStore.roundData == undefined)
      return <div>waiting...</div>
    else
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
        {this.state.saved ?
            <Alert>
            Finimangsparat
            </Alert>
          : ''}
          <Form className='admin-form'>
            <Row  className='form-group'>
          <Col sm='5' className='col-temp'>
              <Label>round name</Label>
              <Input id='round' key='round' type='text' value={this.state.values.round} onChange={this.handleInputChange} disabled={isDisabled} />
              <Label>Programmes</Label>
              <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onChange={this.handleInputChange} isabled={isDisabled}/>
              <Label>examiners</Label>
              <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} isabled={isDisabled}/>
              <Label>responsibles</Label>
              <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onChange={this.handleInputChange} isabled={isDisabled}/>
              <Label>examinationRounds</Label>
              <Input id='examinationRounds' key='examinationRounds' type='text' value={this.state.values.examinationRounds} onChange={this.handleInputChange} isabled={isDisabled}/>
          </Col>
          <Col sm='5' className='col-temp'>
          <Label>registered students</Label>
              <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} isabled={isDisabled}/>
              <Label>examination grade</Label>
              <Input id='examinationGrade' key='examinationGrade' type='text' value={this.state.values.examinationGrade} onChange={this.handleInputChange} isabled={isDisabled} />

              <Label>alteration text</Label>
              <Input id='alterationText' key='alterationText' type='text' value={this.state.values.alterationText} onChange={this.handleInputChange} />
              <Label>commentChange</Label>
              <Input id='commentChange' key='commentChange' type='text' value={this.state.values.commentChange} onChange={this.handleInputChange} />
              <Label>commentExam</Label>
              <Input id='commentExam' key='commentExam' type='text' value={this.state.values.commentExam} onChange={this.handleInputChange} isabled={isDisabled} />
              <Button type="submit" id='Save' key='Save' onClick={this.handleSave}>Save</Button>
              </Col>
            </Row>
            
            </Form>
          </Row>
      </div>
    )
  }
}

export default AdminForm
