import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert} from 'reactstrap'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import i18n from '../../../../i18n/index'

//Components
import YearAndRounds from '../components/YearAndRounds'
import Title from '../components/Title'

//Helpers 
import { EMPTY, ADMIN_URL} from '../util/constants'
const labelIdle = 'Drag & Drop filen här <span class="filepond--label-action"> eller öppna utforskaren </span>'

@inject(['routerStore']) @observer
class AdminForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      saved: false,
      values: this.props.routerStore.analysisData,
      isPublished: this.props.routerStore.roundAnalysis === 'published',
      isNew: this.props.routerStore.roundAnalysis === 'new'
    }
    this.openPreview = this.openPreview.bind(this)
    this.editMode = this.editMode.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  openPreview (event) {
    event.preventDefault()
  }

  editMode(year, rounds){ 
    this.props.routerStore.createAnalysisData(year, rounds)
   
    this.setState({
      isNew: true,
      values: this.props.routerStore.analysisData 
    })
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
    this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri +'/'+ this.props.routerStore.analysisId)
    console.log('postObject', postObject)
    return this.props.routerStore.postRoundAnalysisData(postObject, this.state.isNew)
   .then((data) => {
     thisInstance.setState({
       saved: true,
       isNew: false
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
   .then((response) => {
     console.log(response)
     thisInstance.setState({
       saved: true,
       isPublished: true
     })
   })
  }

  handleInputChange (event) {
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
  
    //console.log("routerStore", routerStore)
    //console.log( "this.state", this.state)
    if(routerStore.analysisData === undefined)
      return (
      <div>
          <h1>{'KURSUTV.....'}</h1>
        <Title title={routerStore.courseData.title} language = {routerStore.language} courseCode={routerStore.courseData.courseCode}/>
      {routerStore.semesters.length === 0
        ?<Alert>No rounds!</Alert>
        : <YearAndRounds 
      editMode={this.editMode}
      semesterList = {routerStore.semesters}
      roundList = {routerStore.roundData}
      />
      }
    </div>)
    else
    return (
      <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' >
      <h1>{'KURSUTV.....'}</h1>
       <Title title={undefined} language = {routerStore.language} courseCode={routerStore.analysisData.courseCode}/>
        
       {routerStore.analysisData.examinationRounds.length === 0 
        ?<Alert>Fel fel fel !</Alert>
        :<div>
        <Row key='preview' id='preview-container'>
          <Col sm='3' className='col-temp'>
            <h4>ID </h4>
            <p id='_id' key='id' >{this.state.values._id}</p>
            <h4>course code </h4>
            <p id='courseCode' key='courseCode'>{this.state.values.courseCode}</p>
            <h4>round name </h4>
            <p id='analysisName' key='round' >{this.state.values.analysisName}</p>
          </Col>
          <Col sm='3' className='col-temp'>
            <h4>targetGroup </h4>
            <p id='programmeCodes' key='programmeCodes' >{this.state.values.programmeCodes} </p>
            <h4>examiners </h4>
            <p id='examiners' key='examiners' >{this.state.values.examiners}</p>
            <h4>responsibles </h4>
            <p id='responsibles' key='responsibles' >{this.state.values.responsibles}</p>
          </Col>
          <Col sm='3' className='col-temp' >
            <h4>examinationRounds </h4>
            <p id='examinationRounds' key='examinationRounds' >{this.state.values.examinationRounds.toString()}</p>
            <h4>registered students </h4>
            <p id='registeredStudents' key='registeredStudents' >{this.state.values.registeredStudents}</p>
            <h4>examination grade </h4>
            <p id='examinationGrade' key='examinationGrade' >{this.state.values.examinationGrade} %</p>
          </Col>
          <Col sm='3' className='col-temp'>
            <h4>alteration text </h4>
            <p id='alterationText' key='alterationText' >{this.state.values.alterationText}</p>
            <h4>commentChange </h4>
            <p id='commentChange' key='commentChange' >{this.state.values.commentChange}</p>
            <h4>commentExam </h4>
            <p id='commentExam' key='commentExam' dangerouslySetInnerHTML={{__html: this.state.values.commentExam}}/>
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
              <Input id='analysisName' key='round' type='text' value={this.state.values.analysisName} onChange={this.handleInputChange} disabled={isDisabled} />
              <Label>Programmes</Label>
              <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examiners</Label>
              <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>responsibles</Label>
              <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examinationRounds</Label>
              <Input id='examinationRounds' key='examinationRounds' type="textarea" value={this.state.values.examinationRounds} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>registered students</Label>
              <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} disabled={isDisabled}/>
              <Label>examinationGrade</Label>
              <Input id='examinationGrade' key='examinationGrade' type='number'  value={this.state.values.examinationGrade} onChange={this.handleInputChange} disabled={isDisabled}/>
          </Col>
          <Col sm='5' className='col-temp'>
         
              <Label>alteration text (max xxx tecken)</Label>
              <Input id='alterationText' key='alterationText' type="textarea" value={this.state.values.alterationText} onChange={this.handleInputChange} />
              <Label>commentChange (max xxx tecken)</Label>
              <Input id='commentChange' key='commentChange' type="textarea" value={this.state.values.commentChange} onChange={this.handleInputChange} />
              <Label>commentExam</Label>
              {this.state.values.commentExam.length === 0 
                ? <Input id='commentExam' key='commentExam' type='textarea' value={this.state.values.commentExam} onChange={this.handleInputChange} disabled={isDisabled} />
                :  <p id='commentExam' key='commentExam' dangerouslySetInnerHTML={{__html: this.state.values.commentExam}}/>
              }
              <Label>upload analysis-pdf</Label>
              <FilePond id="analysis" key="analysis" labelIdle={labelIdle}/>
              <Label>upload PM-file</Label>
              <FilePond id="pm" key="pm" labelIdle={labelIdle}/>
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
       }
      </div>
    )
  }
}

export default AdminForm
