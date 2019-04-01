import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert} from 'reactstrap'

import i18n from '../../../../i18n/index'
//import { EMPTY, FORSKARUTB_URL, ADMIN_URL, SYLLABUS_URL } from '../util/constants'

@inject(['routerStore']) @observer
class AdminForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      saved: false,
      values: this.props.routerStore.roundData,
      isPublished: this.props.routerStore.roundData.isPublished,
      isNew: false
    }
    this.openPreview = this.openPreview.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
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
    return this.props.routerStore.postRoundAnalysisData(postObject, this.state.isNew)
   .then((data) => {
     thisInstance.setState({
       saved: true
     })
   })
  }

  handlePublish (event) {
    event.preventDefault()
    let postObject = this.state.values
    postObject.isPublished = true
    const thisInstance = this
    console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, false)
   .then((data) => {
   
     thisInstance.setState({
       saved: true,
       isPublished: true
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
    const isDisabled =  this.state.isPublished === true
  
    console.log("routerStore, this.state.values", routerStore, isDisabled)
    if(routerStore.roundData == undefined)
      return <div>waiting...</div>
    else
    return (
      <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' >
        <br /><br /><br />
        <Row key='preview' id='preview-container'>
          <Col sm='3' className='col-temp'>
            <h4>ID </h4>
            <p id='_id' key='id' >{this.state.values._id}</p>
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
          <Button id='Publish' key='SaPublishve' onClick={this.handlePublish}>Publish</Button>
        </Row>
        <br />
        <p>--------------------------------------------------------------------------------------------------------------------------</p>
     
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
              <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examiners</Label>
              <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>responsibles</Label>
              <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examinationRounds</Label>
              <Input id='examinationRounds' key='examinationRounds' type='text' value={this.state.values.examinationRounds} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>registered students</Label>
              <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examination grade</Label>
              <Input id='examinationGrade' key='examinationGrade' type='text' value={this.state.values.examinationGrade} onChange={this.handleInputChange} disabled={isDisabled} />

          </Col>
          <Col sm='5' className='col-temp'>
         
              <Label>alteration text (max xxx tecken)</Label>
              <Input id='alterationText' key='alterationText' type="textarea" value={this.state.values.alterationText} onChange={this.handleInputChange} />
              <Label>commentChange (max xxx tecken)</Label>
              <Input id='commentChange' key='commentChange' type="textarea" value={this.state.values.commentChange} onChange={this.handleInputChange} />
              <Label>commentExam</Label>
              <Input id='commentExam' key='commentExam' type='textarea' value={this.state.values.commentExam} onChange={this.handleInputChange} disabled={isDisabled} />
              <Button type="submit" id='Save' key='Save' onClick={this.handleSave}>Save</Button>
              </Col>
            </Row>
            <Label>ID</Label>
              <Input id='_id' key='round' type='id' value={this.state.values._id} onChange={this.handleInputChange} disabled={isDisabled} />
   
              <Label>courseCode</Label>
              <Input id='courseCode' key='courseCode' type='text' value={this.state.values.courseCode} onChange={this.handleInputChange} disabled={isDisabled} />
    
            </Form>
          </Row>
      </div>
    )
  }
}

export default AdminForm
