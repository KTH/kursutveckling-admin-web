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

//Helpers 
import { SERVICE_URL } from '../util/constants'
import { getTodayDate, isValidDate } from '../util/helpers'
import i18n from '../../../../i18n/index'


@inject(['routerStore']) @observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved: this.props.routerStore.analysisData !== undefined && this.props.routerStore.analysisData.changedDate.length > 2,
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
      notValid: [],
      fileProgress: {
        pm: 0,
        analysis: 0
      }
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
    this.getMetadata = this.getMetadata.bind(this)
    //this.divTop = React.createRef() 
    this.hanleUploadFile = this.hanleUploadFile.bind(this)
    this.handleRemoveFile = this.handleRemoveFile.bind(this)
    this.validateData = this.validateData.bind(this)
  }


//*********************************  FILE UPLOAD  ********************************* */
//********************************************************************************** */

  async hanleUploadFile(id, file, e){
    console.log('file', file)
    if(e.target.files[0].type === 'application/pdf'){
     response = await this.sendRequest(id, file, e)
    } else {
      const notValid = id === 'analysis' ? ['analysisFile'] : ['pmFile']
      this.setState({
        notValid: notValid,
        alertError: i18n.messages[this.props.routerStore.language].messages.alert_not_pdf
      })
    }
  }

  sendRequest(id, file, e) {
    const thisInstance = this
    const fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
         //console.log(fileProgress[id])
          this.setState({ fileProgress: fileProgress })
        }
       })

      req.onreadystatechange = function() {
        let values = thisInstance.state.values
        if (this.readyState == 4 && this.status == 200) {
          
          if(id === 'analysis'){
            values.pdfAnalysisDate = getTodayDate()
            fileProgress.analysis = 0
            thisInstance.setState({
              analysisFile: this.responseText, 
              alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              values: values,
              hasNewUploadedFileAnalysis: true,
              notValid: [],
              alertError: ''
            })
            } else {
              values.pdfPMDate = getTodayDate()
              fileProgress.pm = 0
              thisInstance.setState({
                pmFile: this.responseText,  
                alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
                values: values,
                notValid: [],
                alertError: ''
              })
            }
        }
      }

      let formData = new FormData()
      const data = this.getMetadata(this.state.isPublished ? 'published' : this.state.saved ? 'draft' : 'new')
      formData.append("file", e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('analysis', data.analysis)
      formData.append('status', data.status)
      req.open("POST", `${this.props.routerStore.browserConfig.hostUrl}${this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]}${this.props.routerStore.analysisData._id}/${id}/${this.state.isPublished}`);
      req.send(formData)
    })
  }

  getMetadata(status){
    return {
      courseCode: this.state.values.courseCode,
      analysis: this.state.values._id,
      status
    }
  }

  handleRemoveFile(event){
    event.target.id === 'remove_analysis'
    ? this.setState({analysisFile: '', hasNewUploadedFileAnalysis: true})
    : this.setState({pmFile: '', hasNewUploadedFilePM: true})
  }
  
//***************************** BUTTON CLICK HANDLERS ****************************** */
//********************************************************************************** */

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
      window.scrollTo(0, 300)
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

    if( !this.state.saved && this.state.analysisFile.length > 0 ){
      routerStore.updateFileInStorage(this.state.analysisFile, this.getMetadata('draft'))
    }

    return routerStore.postRoundAnalysisData(postObject, postObject.changedDate.length === 0 )
      .then((data) => {
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
      routerStore.updateFileInStorage(this.state.analysisFile, this.getMetadata('published'))
      postObject.publishedDate = getTodayDate()
      postObject.isPublished = true
    }
    
    postObject.analysisFileName = this.state.analysisFile
    return this.props.routerStore.postRoundAnalysisData(postObject, this.props.routerStore.status === 'new' )
      .then((response) => {
        //console.log('handlePublish!!!!!', response)
        modal.publish = false
        if(response === undefined || response.message){
          this.setState({
            alert: response.message ? response.message : 'No connection with data base',
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


  //************************ OTHER **************************** */
  //********************************************************************************** */

  editMode(semester, rounds, analysisId, status, tempData) { 
    const thisAdminPage = this
    
    if (status === 'new') {
      return this.props.routerStore.createAnalysisData(semester, rounds).then( data => {
        const valuesObject = this.handleTemporaryData(thisAdminPage.props.routerStore.analysisData, tempData)
        thisAdminPage.setState({
          progress: "edit",
          isPreviewMode: false,
          isPublished: false,
          values: valuesObject.values,
          activeSemester: semester,
          analysisFile: valuesObject.files.analysisFile,
          pmFile:  valuesObject.files.pmFile,
          alert: ''
        })
    })
    } else {
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + analysisId)
      return thisAdminPage.props.routerStore.getRoundAnalysis(analysisId).then(analysis => {
        const valuesObject = this.handleTemporaryData(thisAdminPage.props.routerStore.analysisData, tempData)
        thisAdminPage.setState({
          progress: 'edit',
          isPreviewMode: false,
          isPublished: thisAdminPage.props.routerStore.analysisData.isPublished,
          values: valuesObject.values,
          analysisFile: valuesObject.files.analysisFile,
          pmFile:  valuesObject.files.pmFile,
          saved: true,
          alert: ''
        })
      })
    }
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
      //saved: false,
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
    else{
      if(!isValidDate(values.pdfAnalysisDate)){
        invalidList.push('pdfAnalysisDate')
      }
    }
    if(this.state.isPublished && values.commentChange.length === 0){
      invalidList.push('commentChange')
    }
    else{
      if(!isValidDate(values.pdfPMDate)){
        invalidList.push('pdfPMDate')
      }
    }
    return invalidList
  }

  getTempData(){
    if( this.state.progress === 'back_new' ){
      const { alterationText, examinationGrade, registeredStudents, roundIdList } = this.state.values
      const { pmFile, analysisFile } = this.state
      return { alterationText, examinationGrade, registeredStudents, roundIdList,  pmFile, analysisFile }
    }
    return null
  }

  handleTemporaryData(valueObject, tempData){
    let returnObject = {
      values: valueObject,
      files: {
        pmFile: '',
        analysisFile: ''
      }
    }
    if(tempData){
      returnObject.values.alterationText = tempData.alterationText
      returnObject.values.registeredStudents = tempData.registeredStudents
      returnObject.values.examinationGrade = tempData.examinationGrade
      returnObject.files.analysisFile = tempData.analysisFile
      returnObject.files.pmFile = tempData.pmFile
    }else{
      if(valueObject){
        returnObject.files.analysisFile =  valueObject.analysisFileName,
        returnObject.files.pmFile = valueObject.pmFileName 
      }
    }
    return returnObject
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
    const { isPublished, fileProgress } = this.state
    const translate = i18n.messages[routerStore.language].messages
 
    if (routerStore.browserConfig.env === 'dev'){
      console.log("routerStore1", routerStore)
      console.log("this.state1", this.state)
    }
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
                showProgressBar = {true}
                />
         
              {/************************************************************************************* */}
              {/*                               PAGE1: ANALYSIS MENU                             */}
              {/************************************************************************************* */}
              {routerStore.semesters.length === 0
                ?<Alert color='info' className='margin-bottom-40'> {translate.alert_no_rounds} </Alert>
                : <AnalysisMenu
                  editMode= { this.editMode }
                  semesterList= { routerStore.semesters }
                  roundList= { routerStore.roundData }
                  progress= { this.state.progress }
                  activeSemester= { this.state.activeSemester } 
                  firstVisit = { routerStore.analysisData === undefined }
                  status = { routerStore.status }
                  tempData = {/*this.state.saved ? {} : */ this.getTempData()}
                  saved = { this.state.values && this.state.values.changedDate.length > 0}
                  analysisId = {this.state.saved && this.state.values ? this.state.values._id : ''}
                />
              }
            </div>
            :<Alert className='margin-bottom-40' color='info'> { routerStore.errorMessage }</Alert>
          }
        </div>
      )
    else
      return (
        <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' ref={(ref) => this._div = ref} >
        {/************************************************************************************* */}
        {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                               */}
        {/************************************************************************************* */}
         {
           routerStore.errorMessage.length > 0
            ?<Alert color='info' className='margin-bottom-40'>{routerStore.errorMessage}</Alert>
            :<div>

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
                 {/* Intro text for Edit */}
                  <div>
                    <p>{translate.intro_edit}</p>
                  </div>

                {/* Semester and name of analysis */}
                <h2>{translate.header_edit_content}</h2>
                <h3>{translate.header_semester} {
                  `${translate.course_short_semester[this.state.values.semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${this.state.values.semester.toString().match(/.{1,4}/g)[0]}`
                  }</h3>
                <h3>{translate.header_course_offering} {this.state.values.analysisName}</h3>
              
                {/* ALERTS */}
                {this.state.alert.length > 0 
                  ? <Row>
                    <Alert color= 'info' className='margin-bottom-40'>{this.state.alert} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertSuccess.length > 0 
                  ? <Row>
                    <Alert color= 'success' >{this.state.alertSuccess} </Alert>
                  </Row>
                  : ''
                }  
                {this.state.alertError.length > 0 
                  ? <Row>
                    <Alert color= 'danger'>{this.state.alertError} </Alert>
                  </Row>
                  : ''
                }  

               {/* FORM - FIRST COLUMN */}
                <Row className='form-group'>
                  <Col sm='4' className='col-form'>
                    <h4>{translate.header_upload}</h4>
                    {/*********************/}
                    {/** ANALYSIS UPLOAD **/}
                    {/*********************/}
                    
                     <FormLabel translate = {translate} header = {'header_upload_file'} id = {'info_upload_course_analysis'} />
                     <UpLoad id="analysis" key="analysis" 
                      handleUpload = {this.hanleUploadFile} 
                      progress={fileProgress.analysis} 
                      path={routerStore.browserConfig.proxyPrefixPath.uri}
                      file = {this.state.analysisFile}
                      notValid = {this.state.notValid}
                      handleRemoveFile ={this.handleRemoveFile}
                      type = 'analysisFile'
                      />
                      { this.state.analysisFile.length > 0 
                        ? <span>
                         <FormLabel translate = {translate} header = {'header_upload_file_date'} id = {'info_upload_course_analysis_date'} />
                         <Input id='pdfAnalysisDate' key='pdfAnalysisDate' type='date' 
                           value={this.state.values.pdfAnalysisDate} 
                           onChange={this.handleInputChange} 
                           className = {this.state.notValid.indexOf('pdfAnalysisDate') > -1 ? 'not-valid' : ''}
    
                          />
                           </span>
                        : ''
                      }

                    <br/>
                    {/**************/}
                    {/** PM UPLOAD */}
                    {/**************/}
                    <FormLabel translate = {translate} header = {'header_upload_file_pm'} id = {'info_upload_course_memo'} />
                    <UpLoad id="pm" key="pm" 
                      handleUpload = {this.hanleUploadFile} 
                      progress={fileProgress.pm} 
                      path={routerStore.browserConfig.proxyPrefixPath.uri}
                      file = {this.state.pmFile}
                      notValid = {this.state.notValid}
                      handleRemoveFile ={this.handleRemoveFile}
                      type = 'pmFile'
                      />
                       { this.state.pmFile.length > 0 
                        ? <span>
                         <FormLabel translate = {translate} header = {'header_upload_file_pm_date'} id = {'info_upload_course_memo_date'} />
                         <Input id='pdfPMDate' key='pdfPMDate' type='date' 
                           value={this.state.values.pdfPMDate} 
                           onChange={this.handleInputChange} 
                           className = {this.state.notValid.indexOf('pdfPMDate') > -1 ? 'not-valid' : ''}
                           />
                           </span>
                        : ''
                      }
                  </Col>

                  {/* FORM - SECOND COLUMN */}
                  <Col sm='4' className='col-form'>
                    <h4>{translate.header_summarize}</h4>

                    <FormLabel translate = {translate} header = {'header_course_changes_comment'} id = {'info_course_changes_comment'} />
                    <Input style={{ height: 300 }} id='alterationText' key='alterationText' type="textarea" 
                      value={this.state.values.alterationText} 
                      onChange={this.handleInputChange} 
                    />
                  </Col>  

                  {/* FORM - THIRD COLUMN */}
                  <Col sm='4' className='col-form'>
                    <h4>{translate.header_check_data}</h4>
                    <p>{translate.asterix_text}</p>

                    <FormLabel translate = {translate} header = {'header_registrated'} id = {'info_registrated'} />
                    <Input id='registeredStudents' key='registeredStudents' type='number' 
                      placeholder = '0' 
                      value={this.state.values.registeredStudents} 
                      onChange={this.handleInputChange} disabled={isPublished} 
                      className = {this.state.notValid.indexOf('registeredStudents') > -1 ? 'not-valid' : ''}
                    />
                    
                    <FormLabel translate = {translate} header = {'header_examination_grade'} id = {'info_examination_grade'} />
                    <Input id='examinationGrade' key='examinationGrade' type='number' 
                      placeholder = '0' 
                      value={this.state.values.examinationGrade} 
                      onChange={this.handleInputChange} disabled={isPublished} 
                      className = {this.state.notValid.indexOf('examinationGrade') > -1 ? 'not-valid' : ''}
                    />
                      
                    <FormLabel translate = {translate} header = {'header_examiners'} id = {'info_examiners'} />
                    <Input id='examiners' key='examiners' type='text' 
                      value={this.state.values.examiners} 
                      onChange={this.handleInputChange} 
                      disabled={isPublished}
                      className = {this.state.notValid.indexOf('examiners') > -1 ? 'not-valid' : ''}
                    />
                     
                     <FormLabel translate = {translate} header = {'header_responsibles'} id = {'info_responsibles'} />
                      <Input id='responsibles' key='responsibles' type='text' 
                        value={this.state.values.responsibles} 
                        onChange={this.handleInputChange} 
                        disabled={isPublished} 
                        className = {this.state.notValid.indexOf('responsibles') > -1 ? 'not-valid' : ''}
                      />

                      { isPublished
                        ? <span>
                          <FormLabel translate = {translate} header = {'header_analysis_edit_comment'} id = {'info_edit_comments'} />
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
            {/*                                BUTTONS FOR PAG 2 AND 3                              */}
            {/************************************************************************************* */}
            {this.state.isPreviewMode && this.state.values.changedDate.length > 0 && routerStore.status !== 'preview' && routerStore.analysisId
              ?  <CopyText textToCopy={ routerStore.browserConfig.hostUrl + 
                                        routerStore.browserConfig.proxyPrefixPath.uri + '/preview/' +   
                                        routerStore.analysisId + '?title=' + encodeURI(routerStore.courseTitle.name+'_'+
                                        routerStore.courseTitle.credits)
                                      } />
              : ''
            }
             
            <Row className="button-container text-center" >  
              <Col sm="4" className ='align-left-sm-center'>
                { routerStore.status === 'preview'
                  ? ''
                  : <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                      <div className="iconContainer arrow-back"/> 
                        { this.state.isPreviewMode ? translate.btn_back_edit : translate.btn_back }
                  </Button>
                }
              </Col>
              <Col sm="3" className='align-right-sm-center' >
                { routerStore.status !== 'preview'
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
          {/************************************************************************************* */}
          {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
          {/************************************************************************************* */}  
          <InfoModal type = 'publish' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.publish} id={this.props.routerStore.analysisId} handleConfirm={this.handlePublish} infoText={translate.info_publish}/>
          <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={this.props.routerStore.analysisId} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
          </div>
         }
        </div>
      )
  }
}

const FormLabel = ({ translate, header, id }) => {
  return(
    <span className='inline-flex'>
      <Label>{translate[header]} *</Label>
      <InfoButton id = {id} textObj = {translate[id]}/>
    </span>
  )
}



export default AdminPage
