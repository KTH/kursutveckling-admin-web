import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'

//Components
import Title from '../components/Title'
import AnalysisMenu from '../components/AnalysisMenu'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal'
import CopyText from '../components/CopyText' 
import InfoButton from '../components/InfoButton'
import UpLoad from '../components/UpLoad'
import ProgressBar from '../components/ProgressBar'

//Helpers 
import { EMPTY, SERVICE_URL } from '../util/constants'
import { getTodayDate , getDateFormat } from '../util/helpers'
import i18n from '../../../../i18n/index'
import images from '../../../img/*.svg'

@inject(['routerStore']) @observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved: false,
      values: this.props.routerStore.analysisData,
      isPublished: this.props.routerStore.analysisData ? this.props.routerStore.analysisData.isPublished : this.props.routerStore.status === 'published',
      progress: this.props.routerStore.status === 'new' ? 'new' : 'edit',
      isPreviewMode: this.props.routerStore.status === 'preview',
      activeSemester: '',
      changedStatus: false,
      modalOpen:{
        publish: false,
        cancel: false
      },
      alert: '',
      alertSuccess: '',
      alertError: '',
      madatoryMessage: '',
      analysisFile: this.props.routerStore.analysisData ? this.props.routerStore.analysisData.analysisFileName : '',
      pmFile: this.props.routerStore.analysisData ? this.props.routerStore.analysisData.pmFileName : '',
      hasNewUploadedFilePM: false,
      hasNewUploadedFileAnalysis: false,
      notValid: []
    }
    this.handlePreview = this.handlePreview.bind(this)
    this.editMode = this.editMode.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.getTempData = this.getTempData.bind(this)
    //this.divTop = React.createRef() 
    //this.fileInput = React.createRef()
    this.hanleUploadFile = this.hanleUploadFile.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.validateData = this.validateData.bind(this)
  }

  handleRemoveFile(event){
    console.log(event.target.id)
    event.target.id === 'removeAnalysis'
    ? this.setState({analysisFile: '', hasNewUploadedFileAnalysis: true})
    : this.setState({pmFile: '', hasNewUploadedFilePM: true})
  }


  async hanleUploadFile(id, file, e){
   let response = await this.sendRequest(id, file, e)
  }

  sendRequest(id, file, e) {
    const thisInstance = this
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.onreadystatechange = function() {
        let values = thisInstance.state.values
        if (this.readyState == 4 && this.status == 200) {
          values.pdfAnalysisDate = getTodayDate()
          if(id === 'analysis'){
          thisInstance.setState({
            analysisFile: this.responseText, 
            alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
            values: values,
            hasNewUploadedFileAnalysis: true,
            alertError:''
           })
          } else {
            values.pdfPMDate = getTodayDate()
            thisInstance.setState({
              pmFile: this.responseText,  
              alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              values: values
            })
          }
        }
      }

      let formData = new FormData()
      formData.append("file", e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', this.state.values.courseCode)
      formData.append('analysis', this.state.values._id)
      //formData.append('rounds', this.state.values._id.split('_')[])
      formData.append('status', this.state.isPublished ? 'published' : 'draft')
      req.open("POST", `${this.props.routerStore.browserConfig.hostUrl}${this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]}${this.props.routerStore.analysisData._id}/${id}/${this.state.isPublished}`);
      req.send(formData)
    })
  }

  
  getTempData(){
    if( this.state.progress === 'back_new' && this.state.values.changedDate.length === 0 ){
      const {alterationText, examinationGrade, registeredStudents, roundIdList} = this.state.values
      return { alterationText, examinationGrade, registeredStudents, roundIdList }
    }
    return null
  }

  handlePreview(event) { 
    event.preventDefault()
    let invalidList = this.validateData(this.state.values)
    if(invalidList.length > 0){
      this.setState({
        notValid: invalidList,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_empty_fields
      })
    }else{
      this.setState({
        isPreviewMode: true,
        progress: 'preview',
        alertError: '',
        notValid: invalidList
      })
    }
  }

  handleBack(event) {
    event.preventDefault()
    const thisAdminPage = this
    const routerStore = this.props.routerStore
    if (this.state.progress === 'edit') {
      this.props.history.push(routerStore.browserConfig.proxyPrefixPath.uri + '/' + routerStore.courseCode)
      if (routerStore.semesters.length === 0){
        return routerStore.getCourseInformation(routerStore.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: routerStore.analysisData.semester,
              analysisFile:'',
              alert: ''
            })
          })
      }
      this.setState({
        isPreviewMode: false,
        progress: 'back_new',
        activeSemester: routerStore.analysisData.semester,
        alert: ''
      })
    }
    if (this.state.isPreviewMode) { 
      this.setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: ''
      })
    }
  }

  handleCancel(event) {
    window.location=`${SERVICE_URL[this.props.routerStore.service]}${this.props.routerStore.analysisData.courseCode}?serv=kutv&event=cancel`
  }


  editMode(semester, rounds, analysisId, status, tempData) {
    const thisAdminPage = this
    if (status === 'new') {
      return this.props.routerStore.createAnalysisData(semester, rounds).then( data => {
        let values = thisAdminPage.props.routerStore.analysisData
        if(tempData){
        values.alterationText = tempData.alterationText
        values.registeredStudents = tempData.registeredStudents
        values.examinationGrade = tempData.examinationGrade
        }
      thisAdminPage.setState({
        progress: "edit",
        isPreviewMode: false,
        isPublished: false,
        values,
        activeSemester: semester,
        analysisFile: thisAdminPage.props.routerStore.analysisData ? thisAdminPage.props.routerStore.analysisData.analysisFileName : '',
        alert: ''
      })
    })
    }
    else {
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + analysisId)
      return thisAdminPage.props.routerStore.getRoundAnalysis(analysisId).then(analysis => {
        thisAdminPage.setState({
          progress: 'edit',
          isPreviewMode: false,
          isPublished: thisAdminPage.props.routerStore.analysisData.isPublished,
          values: thisAdminPage.props.routerStore.analysisData,
          analysisFile: thisAdminPage.props.routerStore.analysisData ? thisAdminPage.props.routerStore.analysisData.analysisFileName : '',
          alert: ''
        })
      })
    }
  }

  handleSave(event) {
    event.preventDefault()
    const postObject = this.state.values
    const thisInstance = this
    const { routerStore } = this.props
  
    if(this.state.analysisFile !== postObject.analysisFileName){
      postObject.analysisFileName = this.state.analysisFile
    }

    if(this.state.pmFile !== postObject.pmFileName){
      postObject.pmFileName = this.state.pmFile
      //postObject.pdfPmDate = getTodayDate()
    }

    /*if( this.state.hasNewUploadedFileAnalysis ){
      postObject.pdfAnalysisDate = getTodayDate()
    }*/

    return routerStore.postRoundAnalysisData(postObject, postObject.changedDate.length === 0 )
      .then((data) => {
        console.log('postObject', data)
        if(this.state.isPreviewMode){
          window.location= encodeURI(`${routerStore.browserConfig.hostUrl}${SERVICE_URL[routerStore.service]}${routerStore.analysisData.courseCode}?serv=kutv&event=save&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${routerStore.analysisData.analysisName}`)// term=, name=
        }
        else{
          thisInstance.setState({
            saved: true,
            progress: 'edit',
            alertSuccess: i18n.messages[routerStore.language].messages.alert_saved_draft,
            hasNewUploadedFileAnalysis: false,
            hasNewUploadedFilePM: false,
            values: data
          })
          thisInstance.props.history.push(thisInstance.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + thisInstance.props.routerStore.analysisId)
        }  
      })
  }

  handlePublish(event, fromModal = false) {
    if(!fromModal){    
      event.preventDefault()
    }
    const { routerStore } = this.props
    const thisInstance = this
    let postObject = this.state.values
    let modal = this.state.modalOpen
    
    if( this.state.hasNewUploadedFileAnalysis ){
      postObject.pdfAnalysisDate = getTodayDate()
    }

    if(this.state.pmFile !== postObject.pmFileName){
      postObject.pmFileName = this.state.pmFile
    }

    
    if(postObject.isPublished){
      postObject.changedAfterPublishedDate = getTodayDate()
    }else{
      postObject.publishedDate = getTodayDate()
      postObject.isPublished = true
    }
    
    postObject.analysisFileName = this.state.analysisFile
    console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, this.props.routerStore.status === 'new' )
      .then((response) => {
        console.log('handlePublish!!!!!', response)
        modal.publish = false
        if(response.message){
          this.setState({
            alert: response.message,
            modalOpen: modal
          })
        }else{
          thisInstance.setState({
            saved: true,
            isPublished: true,
            modalOpen: modal,
            values: response
          })
          window.location= encodeURI(`${routerStore.browserConfig.hostUrl}${SERVICE_URL[routerStore.service]}${routerStore.analysisData.courseCode}?serv=kutv&event=pub&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${routerStore.analysisData.analysisName}`)
        }
      })  
  }

  toggleModal(event){
    let modalOpen = this.state.modalOpen
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    this.setState({
      modalOpen: modalOpen
    })
  }

  handleInputChange(event) {
    let values = this.state.values
    values[event.target.id] = event.target.value
    this.setState({
      values: values,
      saved: false,
      notValid: [],
      alertError:''
    })
  }

  validateData(values){
    let invalidList = []
    const toValidate = ['registeredStudents', 'examinationGrade', 'examiners', 'responsibles']
    for (let key of toValidate) {
      if( values[key].length === 0){
        invalidList.push(key)
      }
    }
    if(this.state.analysisFile.length === 0){
      invalidList.push('analysisFile')
    }
    if(this.state.isPublished && values.commentChange.length === 0){
      invalidList.push('commentChange')
    }
    return invalidList
  }

  componentDidUpdate() {
    const thisInstance = this
    if(thisInstance.state.alertSuccess.length > 0){
      setTimeout(() => {
        thisInstance.setState({ alertSuccess: '' })
      }, 5000)
    }
  }

  render() {
    const { routerStore } = this.props
    const { isPublished }= this.state
    const translate = i18n.messages[routerStore.language].messages
    const labelIdle =  translate.add_file 

    console.log("routerStore1", routerStore)
    console.log("this.state1", this.state)
   
    if (routerStore.analysisData === undefined || this.state.progress === 'back_new')
      return (
        <div ref={this.divTop}>
          { routerStore.errorMessage.length === 0
            ? <div>
              <Title 
                title={routerStore.courseTitle} 
                language={routerStore.language} 
                courseCode={routerStore.courseCode} 
                progress = {1}
                header = {translate.header_main[routerStore.status]}
                />
         
              {/************************************************************************************* */}
              {/*                               PAGE1: ANALYSIS MENU                             */}
              {/************************************************************************************* */}
              {routerStore.semesters.length === 0
                ?<Alert color='info' style={{marginBottom:60}}> {translate.alert_no_rounds} </Alert>
                : <AnalysisMenu
                  editMode= { this.editMode }
                  semesterList= { routerStore.semesters }
                  roundList= { routerStore.roundData }
                  progress= { this.state.progress }
                  activeSemester= { this.state.activeSemester } 
                  firstVisit = { routerStore.analysisData === undefined }
                  status = { routerStore.status }
                  tempData = {this.state.saved ? {} : this.getTempData()}
                  saved = { this.state.saved }
                />
              }
            </div>
            :<Alert color='info'> { routerStore.errorMessage }</Alert>
          }
        </div>
      )
    else
      return (
        <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' ref={(ref) => this._div = ref} >
        {/************************************************************************************* */}
        {/*                     PAGE 2: EDIT AND  PAGE 3: PREVIEW                               */}
        {/************************************************************************************* */}
         {
           routerStore.errorMessage.length > 0
            ?<Alert color='info'>{routerStore.errorMessage}</Alert>
            :
          <div>
          
          <Title 
            title={routerStore.courseTitle} 
            language={routerStore.language} 
            courseCode={routerStore.courseCode} 
            progress = {this.state.progress === 'edit' ? 2 : 3}
            header = {translate.header_main[routerStore.status]}
            showProgressBar = {routerStore.status !== 'preview'}
          />
         
          {/************************************************************************************* */}
          {/*                                   PREVIEW                                           */}
          {/************************************************************************************* */}
          {this.state.values && this.state.isPreviewMode
          
            ? <Preview 
              values={ this.state.values } 
              analysisFile= { this.state.analysisFile }
              pmFile = { this.state.pmFile }
            />
            : ""
          }
          <Row key='form' id='form-container' >
          <Col sm="12" lg="12">
            {/************************************************************************************* */}
            {/*                                 EDIT FORM                                               */}
            {/************************************************************************************* */}
              
            {this.state.values && !this.state.isPreviewMode
              ? <Form className='admin-form'>
                  <p>{translate.intro_edit}</p>

                {this.state.alert.length > 0 
                  ? <Row>
                    <Alert color= 'info'>{this.state.alert} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertSuccess.length > 0 
                  ? <Row>
                    <Alert color= 'success'>{this.state.alertSuccess} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertError.length > 0 
                  ? <Row>
                    <Alert color= 'danger'>{this.state.alertError} </Alert>
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
                    
                    {this.state.analysisFile.length > 0
                      ? <div className='inline-flex'>
                        <p className='upload-text'> {this.state.analysisFile} </p>
                         <div className="iconContainer icon-trash-can" id="removeAnalysis" onClick={this.handleRemoveFile}></div>
                      </div>
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
              : ''
            }
            {/************************************************************************************* */}
            {/*                                BUTTONS FOR BOTH PAGES                               */}
            {/************************************************************************************* */}
            {this.state.isPreviewMode && this.state.values.changedDate.length > 0 && routerStore.status !== 'preview' && routerStore.analysisId
              ?   <CopyText textToCopy={ routerStore.browserConfig.hostUrl + routerStore.browserConfig.proxyPrefixPath.uri + '/preview/' + routerStore.analysisId} />
              : ''
            }
             
            <Row className="button-container text-center" >  
                  <Col sm="4" style={{textAlign: 'left'}}>
                    {
                      routerStore.status === 'preview'
                      ? ''
                      : <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                          <div className="iconContainer arrow-back"/> 
                          { this.state.isPreviewMode ? translate.btn_back_edit : translate.btn_back }
                        </Button>
                    }
                  </Col>
                  <Col sm="3" style={{textAlign: 'right'}} >
                    {
                      routerStore.status !== 'preview'
                      ? <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                        {translate.btn_cancel}
                      </Button>
                      : ''
                    }
                  </Col>
                  <Col sm="3">
                  {
                    this.state.isPublished || routerStore.status === 'preview'
                    ? ''
                    : <Button color='secondary' id='save' key='save' onClick={this.handleSave} >
                      {this.state.isPreviewMode ? translate.btn_save_and_cancel : translate.btn_save}
                    </Button>
                  }
                </Col>
                  <Col sm="2">
                  {routerStore.status === 'preview'
                    ? ''
                    : <span>
                     { this.state.isPreviewMode
                      ? <Button color='success' id='publish' key='publish' onClick={this.toggleModal} >
                        {translate.btn_publish}
                      </Button>
                      :<Button color='success' id='preview' key='preview' onClick={this.handlePreview} >
                        <div className="iconContainer arrow-forward"/>  {translate.btn_preview}
                      </Button>
                     }
                      </span>
                    }
                  </Col>
                </Row>
            </Col>
          </Row>
          <InfoModal type = 'publish' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.publish} id={this.props.routerStore.analysisId} handleConfirm={this.handlePublish} infoText={translate.info_publish}/>
          <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={this.props.routerStore.analysisId} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
          </div>
         }
        </div>
      )
  }
}





export default AdminPage
