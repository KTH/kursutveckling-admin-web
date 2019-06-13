import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileMetadata from 'filepond-plugin-file-metadata';

// Register the plugin
registerPlugin(FilePondPluginFileMetadata);

//Components
import Title from '../components/Title'
import AnalysisMenu from '../components/AnalysisMenu'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal'


//Helpers 
import { EMPTY, ADMIN_URL, KURSUTVECKLING_URL } from '../util/constants'
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
      isPublished: this.props.routerStore.status === 'published',
      progress: this.props.routerStore.status === 'new' ? 'new' : 'edit',
      isPreviewMode: this.props.routerStore.status === 'preview',
      activeSemester: '',
      changedStatus: false,
      modalOpen:{
        publish: false,
        cancel: false
      },
      alert: '',
      analysisFile: this.props.routerStore.analysisData ? this.props.routerStore.analysisData.analysisFileName : '',
      analysisFileItem:[],
      pmFile:'',
      pmFileItem:[],
      hasNewUploadedFilePM: false,
      hasNewUploadedFileAnalysis: false
    }
    this.handlePreview = this.handlePreview.bind(this)
    this.editMode = this.editMode.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.processfile = this.processfile.bind(this)
  }

  handleInit() {
    console.log('FilePond instance has initialised', this.pond)
    //this.pond.setState({status:5})
    //this.pond.allowFilesSync =false
    let pondis = this.pond.getFiles()
    //pondis[0].allowFilesSync=false
    console.log('wwwww',this)
  }

  processfile(arg){
   arg ? console.log('processfile', arg) : null
   return false
  }

  handlePreview(event) {
    event.preventDefault()
    this.setState({
      isPreviewMode: true,
      progress: 'preview',
      alert: ''
    })
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
    //event.preventDefault()
    window.location=`${ADMIN_URL}${this.props.routerStore.analysisData.courseCode}?serv=kutv&event=cancel`
  }

  editMode(semester, rounds, analysisId, status) {
    const thisAdminPage = this

    if (status === 'new') {
      return this.props.routerStore.createAnalysisData(semester, rounds).then( data => {
      thisAdminPage.setState({
        progress: "edit",
        isPreviewMode: false,
        isPublished: false,
        values: thisAdminPage.props.routerStore.analysisData,
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

    if( this.state.hasNewUploadedFileAnalysis ){
      postObject.pdfAnalysisDate = getTodayDate()
    }

    return routerStore.postRoundAnalysisData(postObject, postObject.changedDate.length === 0 )
      .then((data) => {
        console.log('postObject', data)
        if(this.state.isPreviewMode){
          window.location= encodeURI(`${routerStore.browserConfig.hostUrl}${ADMIN_URL}${routerStore.analysisData.courseCode}?serv=kutv&event=save&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${routerStore.analysisData.analysisName}`)// term=, name=
        }
        else{
          thisInstance.setState({
            saved: true,
            progress: 'edit',
            alert: 'finimangsparat...',
            hasNewUploadedFileAnalysis: false,
            hasNewUploadedFilePM: false
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

    if(this.state.analysisFile !== postObject.analysisFileName){
      postObject.analysisFileName = this.state.analysisFile
    }

    if( this.state.hasNewUploadedFileAnalysis ){
      postObject.pdfAnalysisDate = getTodayDate()
    }

   
    postObject.analysisFileName = this.state.analysisFile
    if(postObject.publishedDate.length === 0)
       postObject.publishedDate = getTodayDate()
    postObject.isPublished = true

    //console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, this.props.routerStore.status === 'new' )
      .then((response) => {
        console.log('handlePublish', response)
        window.location= encodeURI(`${routerStore.browserConfig.hostUrl}${ADMIN_URL}${routerStore.analysisData.courseCode}?serv=kutv&event=pub&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${routerStore.analysisData.analysisName}`)
        thisInstance.setState({
          saved: true,
          isPublished: true,
          modalOpen: false
        })
      })
  }

  toggleModal(event){
    console.log("modal", event.target === 'modal' )
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
      saved: false
    })
  }

  componentDidUpdate() {
   // window.scrollTo(0, 0)
    //this._div.scrollTop = 0
    window.onpopstate  = (e) => {
      console.log('adminP onpopstate', this.state)
     }
  }

  


  render() {
    const { routerStore } = this.props
    const isDisabled = this.state.isPublished === true
    const translate = i18n.messages[routerStore.language].messages
    const labelIdle =  translate.add_file 

    console.log("routerStore1", routerStore)
    console.log("this.state1", this.state)
   
    if (routerStore.analysisData === undefined || this.state.progress === 'back_new')
      return (
        <div ref={(ref) => this._div = ref}>
          { routerStore.errorMessage.length === 0
            ? <div>
              <Title 
                title={routerStore.courseTitle} 
                language={routerStore.language} 
                courseCode={routerStore.courseData.courseCode} 
                image = {routerStore.browserConfig.proxyPrefixPath.uri + '/static/'+ images[translate.progressImage['first']]}
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
            :''
         }
          <Title 
            title={routerStore.courseTitle} 
            language={routerStore.language} 
            courseCode={routerStore.courseData.courseCode} 
            image = {routerStore.browserConfig.proxyPrefixPath.uri + '/static/'+ images[translate.progressImage[this.state.progress]]}
            header = {translate.header_main[routerStore.status]}
          />
          {this.state.alert.length > 0 ?
              <Alert>
                {this.state.alert}
            </Alert>
              : ''}
          {/************************************************************************************* */}
          {/*                                   PREVIEW                                           */}
          {/************************************************************************************* */}
          {this.state.values && this.state.isPreviewMode
            ? <Preview 
              values={ this.state.values } 
              analysisFile= { this.state.analysisFile }
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
                <h2>{translate.header_edit_content}</h2>
                {/*<h3>{this.state.values.analysisName}</h3>*/}
                <p>{translate.asterix_text}</p>
                <Row className='form-group'>
                  <Col sm='3' className='col-temp'>
                      <Label>{translate.header_upload_file}</Label>
                      <FilePond id="analysis" key="analysis" 
                      onprocessfile = {this.processfile}
                      //instantUpload ={false}
                        labelIdle={labelIdle} 
                        id = 'analysisUpload'
                        ref = {ref => (this.pond = ref)}
                        files = {this.state.analysisFile}
                        //abortLoad ={this.state.analysisFile.length > 0}
                        allowMultiple = {false}
                        maxFiles = {1}
                        oninit={() => this.handleInit() }
                        type='local'
                        onprocessfile={this.processfile('tjohooo')}
                      /* fileMetadataObject ={ {
                          'type': 'analysis',
                          'name':this.props.routerStore.analysisId,
                          'status':this.props.routerStore.isPublished ?'published' : 'draft',
                          'courseCode':this.props.routerStore.courseCode
                        }
                        }*/
                        server= { `${this.props.routerStore.browserConfig.hostUrl}${this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]}${this.props.routerStore.analysisData._id}/analysis/${this.state.isPublished}`}
                        onupdatefiles={fileItems => {
                          console.log('fileItems', fileItems)
                          if(fileItems && fileItems.length > 0)
                          //fileItems[0].abortProcessing()
                          this.state.values['pdfAnalysisDate'] =  getTodayDate()
                            this.setState({
                              hasNewUploadedFileAnalysis: fileItems.fileExtension !== 'text/html',
                              analysisFile: this.props.routerStore.analysisData._id+'.'+fileItems[0].fileExtension,
                              analysisFileItem: fileItems[0],
                            }) 
                        }}
                        >
                        </FilePond>
                      <Label>{translate.header_upload_file_pm}</Label>
                      {/*<FilePond id="pm" key="pm" labelIdle={labelIdle}
                        labelIdle={labelIdle} 
                        ref={ref => (this.pond = ref)}
                        files={this.state.pmFile}
                        allowMultiple={true}
                        maxFiles={1}
                        onupdatefiles={fileItems => {
                          this.setState({
                            pmFile: fileItems.map(fileItem => fileItem.file)
                          }) 
                        }}
                      />*/}
                    </Col>
                    <Col sm='4' className='col-temp'>
                      <Label>{translate.header_course_changes_comment}</Label>
                      <Input style={{ height: 300 }} id='alterationText' key='alterationText' type="textarea" value={this.state.values.alterationText} onChange={this.handleInputChange} />
                    </Col>  
                    <Col sm='4' className='col-temp'>
                      <Label>{translate.header_registrated}*</Label>
                      <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} disabled={isDisabled} />
                      <Label>{translate.header_examination_grade}*</Label>
                      <Input id='examinationGrade' key='examinationGrade' type='number' value={this.state.values.examinationGrade} onChange={this.handleInputChange} disabled={isDisabled} />
                      <Label>{translate.header_examiners}*</Label>
                      <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} disabled={isDisabled} />
                      <Label>{translate.header_responsibles}*</Label>
                      <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onChange={this.handleInputChange} disabled={isDisabled} />
                      {routerStore.status === 'published'
                      ? <span>
                        <Label>{translate.header_analysis_edit_comment}</Label>
                        <Input id='commentChange' key='commentChange' type="textarea" value={this.state.values.commentChange} onChange={this.handleInputChange} />
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
                    <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                      {translate.btn_cancel}
                    </Button>
                  </Col>
                  <Col sm="3">
                  {
                    this.state.isPublished || routerStore.status === 'preview'
                    ? ''
                    : <Button color='success' id='save' key='save' onClick={this.handleSave} >
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
      )
  }
}



export default AdminPage
