import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert} from 'reactstrap'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import i18n from '../../../../i18n/index'

//Components
import Title from '../components/Title'

//Helpers 
import { EMPTY, ADMIN_URL} from '../util/constants'
const labelIdle = 'Drag & Drop filen här <span class="filepond--label-action"> eller öppna utforskaren </span>'

@inject(['routerStore']) @observer
class AnalysisForm extends Component {
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
    //console.log('postObject', postObject)
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
    //console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, false)
   .then((response) => {
     //console.log(response)
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
      <div></div>)
    else
    return (
      <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' >
      
      <Form className='admin-form'>
                  <p>{translate.intro_edit}</p>

                {this.state.alert.length > 0 
                  ? <Row>
                    <Alert color= 'info' className='margin-bottom-40'>{this.state.alert} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertSuccess.length > 0 
                  ? <Row>
                    <Alert color= 'success' className='margin-bottom-40'>{this.state.alertSuccess} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertError.length > 0 
                  ? <Row>
                    <Alert color= 'danger' className='margin-bottom-40'>{this.state.alertError} </Alert>
                  </Row>
                  : ''
                }  
                <h2>{translate.header_edit_content}</h2>
                <h3>{translate.header_semester} {this.state.values.semester}</h3>
                <h3>{translate.header_course_offering} {this.state.values.analysisName}</h3>
              
                <Row className='form-group'>
                  <Col sm='4' className='col-temp'>
                    <h4>{translate.header_upload}</h4>
                    {/** ANALYSIS UPLOAD */}
                    <span className='inline-flex'>
                      <Label>{translate.header_upload_file}</Label>
                      <InfoButton id = 'info_upload_course_analysis' textObj = {translate.info_upload_course_analysis}/>
                    </span>
                    
                    {this.state.analysisFile && this.state.analysisFile.length > 0
                      ? <span>
                        <br/>
                        <div className='inline-flex'>
                        <p className='upload-text'> {this.state.analysisFile} </p>
                         <div className="iconContainer icon-trash-can" id="removeAnalysis" onClick={this.handleRemoveFile}></div>
                      </div>
                      </span>
                      : <div className={this.state.notValid.indexOf('analysisFile') > -1 ? 'not-valid' : ''}>
                        <UpLoad id="analysis" key="analysis" handleUpload = {this.hanleUploadFile}/>
                      </div>
                     
                    }
                    <br/>

                    {/** PM UPLOAD */}
                    <div className='inline-flex'>
                      <Label>{translate.header_upload_file_pm}</Label>
                      <InfoButton id = 'info_upload_course_memo' textObj = {translate.info_upload_course_memo}/>
                    </div>
                   
                   {this.state.pmFile.length > 0
                      ? <span>
                        <br/>
                        <div className='inline-flex '>
                          <p className='upload-text'>{this.state.pmFile}</p>
                          <div className="iconContainer icon-trash-can" id="removePm" onClick={this.handleRemoveFile}></div>
                        </div>
                      </span>
                      : <UpLoad id="memo" key="memo" handleUpload = {this.hanleUploadFile}/>
                    }
                  </Col>


                  <Col sm='4' className='col-temp'>
                    <h4>{translate.header_summarize}</h4>

                    <span className='inline-flex'>
                      <Label>{translate.header_course_changes_comment}</Label>
                        <InfoButton id = 'info_course_changes_comment' textObj = {translate.info_course_changes_comment}/>
                    </span>
                    <Input style={{ height: 300 }} id='alterationText' key='alterationText' type="textarea" 
                      value={this.state.values.alterationText} 
                      onChange={this.handleInputChange} 
                    />
                  </Col>  

                    <Col sm='4' className='col-temp'>
                      <h4>{translate.header_check_data}</h4>
                      <p>{translate.asterix_text}</p>

                      <span className='inline-flex'>
                        <Label>{translate.header_registrated} *</Label>
                        <InfoButton id = 'info_registrated' textObj = {translate.info_registrated}/>
                      </span>
                      <Input id='registeredStudents' key='registeredStudents' type='number' 
                        placeholder = '0' 
                        value={this.state.values.registeredStudents} 
                        onChange={this.handleInputChange} disabled={isPublished} 
                        className = {this.state.notValid.indexOf('registeredStudents') > -1 ? 'not-valid' : ''}
                      />
                      
                      <span className='inline-flex'>
                        <Label>{translate.header_examination_grade} *</Label>
                        <InfoButton id = 'info_examination_grade' textObj = {translate.info_examination_grade}/>
                      </span>
                      <Input id='examinationGrade' key='examinationGrade' type='number' 
                        placeholder = '0' 
                        value={this.state.values.examinationGrade} 
                        onChange={this.handleInputChange} disabled={isPublished} 
                        className = {this.state.notValid.indexOf('examinationGrade') > -1 ? 'not-valid' : ''}
                        />
                      
                      
                      <span className='inline-flex'>
                        <Label>{translate.header_examiners} *</Label>
                        <InfoButton id = 'info_examiners' textObj = {translate.info_examiners}/>
                      </span>
                      <Input id='examiners' key='examiners' type='text' 
                        value={this.state.values.examiners} 
                        onChange={this.handleInputChange} 
                        disabled={isPublished}
                        className = {this.state.notValid.indexOf('examiners') > -1 ? 'not-valid' : ''}

                      />
                     
                      <span className='inline-flex'>
                        <Label>{translate.header_responsibles} *</Label>
                        <InfoButton id = 'info_responsibles' textObj = {translate.info_responsibles}/>
                      </span>
                      <Input id='responsibles' key='responsibles' type='text' 
                        value={this.state.values.responsibles} 
                        onChange={this.handleInputChange} 
                        disabled={isPublished} 
                        className = {this.state.notValid.indexOf('responsibles') > -1 ? 'not-valid' : ''}
                        />

                      { isPublished
                      ? <span>
                          <span className='inline-flex'>
                            <Label>{translate.header_analysis_edit_comment}</Label>
                            <InfoButton id = 'info_edit_comments' textObj = {translate.info_edit_comments}/>
                         </span>
                        <Input id='commentChange' key='commentChange' type="textarea" 
                          value={this.state.values.commentChange} 
                          onChange={this.handleInputChange} 
                          className = {this.state.notValid.indexOf('commentChange') > -1 ? 'not-valid' : ''}
                        />
                      </span>
                      : ''
                      }
                    </Col>
                  </Row> 
              </Form>
          </div>
  )
}
}


export default AdminPage
