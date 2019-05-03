import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

//Components
import Title from '../components/Title'
import AnalysisMenue from '../components/AnalysisMenue'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal'
import i18n from '../../../../i18n/index'

//Helpers 
import { EMPTY, ADMIN_URL } from '../util/constants'


@inject(['routerStore']) @observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved: false,
      values: this.props.routerStore.analysisData,
      isPublished: this.props.routerStore.status === 'published',
      progress: this.props.routerStore.status === 'new' ? 'new' : 'preview',
      isPreviewMode: this.props.routerStore.status !== 'new',
      activeSemester: '',
      changedStatus: false,
      modalOpen:{
        publish: false,
       cancel: false
      },
      alert: '',
      analysisFile: '',
      pmFile:''
    }
    this.handlePreview = this.handlePreview.bind(this)
    this.editMode = this.editMode.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  handlePreview(event) {
    event.preventDefault()
    this.setState({
      isPreviewMode: true
    })
  }

  handleBack(event) {
    event.preventDefault()
    const thisAdminPage = this
    const routerStore = this.props.routerStore
    if (this.state.progress === 'edit') {
      if (routerStore.semesters.length === 0){
        return routerStore.getCourseInformation(routerStore.analysisData.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: routerStore.analysisData.semester,
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
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + this.props.routerStore.courseData.courseCode)
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
    event.preventDefault()
    alert('THIS IS WILL TAKE YOU BACK TO KURSINFO ADMIN IN THE FUTURE...')
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
        alert: ''
      })
    })
    }
    else {
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + analysisId)
      return thisAdminPage.props.routerStore.getRoundAnalysis(analysisId).then(analysis => {
        thisAdminPage.setState({
          progress: 'preview',
          isPreviewMode: true,
          isPublished: thisAdminPage.props.routerStore.analysisData.isPublished,
          values: thisAdminPage.props.routerStore.analysisData,
          alert: ''
        })
      })
    }
  }

  handleSave(event) {
    event.preventDefault()
    const postObject = this.state.values
    const thisInstance = this
    this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + this.props.routerStore.analysisId)

    return this.props.routerStore.postRoundAnalysisData(postObject, this.props.routerStore.status === 'new')
      .then((data) => {
        console.log('postObject', data)
        alert('THIS IS WILL TAKE YOU BACK TO KURSINFO ADMIN IN THE FUTURE... ')
        thisInstance.setState({
          saved: true,
          progress: false,
          alert: 'finimangsparat...'
        })
      })
  }

  handlePublish(event, fromModal = false) {
    if(!fromModal){    
      event.preventDefault()
    }

    let postObject = this.state.values
    postObject.isPublished = true
    const thisInstance = this
    console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, this.props.routerStore.status === 'new' )
      .then((response) => {
        console.log('handlePublish', response)
        alert("THIS IS WILL TAKE YOU BACK TO KURSINFO ADMIN IN THE FUTURE... ")
        thisInstance.setState({
          saved: true,
          isPublished: true,
          modalOpen: false
        })
      })
  }

  toggleModal(event){
    console.log("modal", event.target.id)
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
    window.scrollTo(0, 0)
    //this._div.scrollTop = 0
  }


  render() {
    const routerStore = this.props.routerStore
    const isDisabled = this.state.isPublished === true
    const translate = i18n.messages[routerStore.language].messages
    const labelIdle =  translate.add_file 

    console.log("routerStore1", routerStore)
    console.log("this.state1", this.state, translate)
    if (routerStore.analysisData === undefined || this.state.progress === 'back_new')
      return (
        <div ref={(ref) => this._div = ref}>
          <h1>{translate.header_main}</h1>
          { routerStore.errorMessage.length === 0
            ? <div>
              <Title title={routerStore.courseTitle} language={routerStore.language} courseCode={routerStore.courseData.courseCode} />
              {routerStore.semesters.length === 0
                ? <Alert color="friendly">No rounds!</Alert>
                : <AnalysisMenue
                  editMode= { this.editMode }
                  semesterList= { routerStore.semesters }
                  roundList= { routerStore.roundData }
                  progress= { this.state.progress }
                  activeSemester= { this.state.activeSemester } 
                  firstVisit = { routerStore.analysisData === undefined }
                />
              }
            </div>
            : <Alert color="friendly"> { routerStore.errorMessage }</Alert>
          }
        </div>
      )
    else
      return (
        <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' ref={(ref) => this._div = ref} >
          <h1>{translate.header_main}</h1>
          <Title title={routerStore.courseTitle} language={routerStore.language} courseCode={routerStore.analysisData.courseCode} />
          <Row>
            <Col sm="12" lg="12">
              <h2>{this.state.values.analysisName}</h2>
            </Col>
          </Row>

          {this.state.alert.length > 0 ?
              <Alert>
                {this.state.alert}
            </Alert>
              : ''}

          {this.state.values && this.state.isPreviewMode
            ? <Preview values={this.state.values} />
            : ""
          }
          <Row key='form' id='form-container' >
          <Col sm="12" lg="12">
            {this.state.values && !this.state.isPreviewMode
              ? <Form className='admin-form'>
              <h2>{translate.edit_content}</h2>
              <p>{translate.asterix_text}</p>
                <Row className='form-group'>
                  <Col sm='4' className='col-temp'>
                 {/**   <Label>{translate.header_programs}*</Label>
                    <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>{translate.header_examiners}*</Label>
                    <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>{translate.header_responsibles}*</Label>
                    <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibled} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>{translate.header_examination}*</Label>
                    <Input id='examinationRounds' key='examinationRounds' type="textarea" value={this.state.values.examinationRounds} onChange={this.handleInputChange} disabled={isDisabled} />
                   */}  <Label>{translate.header_registrated}*</Label>
                    <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>{translate.header_examination_grade}*</Label>
                    <Input id='examinationGrade' key='examinationGrade' type='number' value={this.state.values.examinationGrade} onChange={this.handleInputChange} disabled={isDisabled} />
                  </Col>
                  <Col sm='4' className='col-temp'>
                {/*    <Label>{translate.header_examination_comment}*</Label>
                    {routerStore.examCommentEmpty || ( this.state.values.commentExam && this.state.values.commentExam.indexOf('</') ) < 0
                      ? <Input id='commentExam' key='commentExam' type='textarea' value={this.state.values.commentExam} onChange={this.handleInputChange} disabled={isDisabled} />
                      : <span id='commentExam' key='commentExam' dangerouslySetInnerHTML={{ __html: this.state.values.commentExam }} />
                    }
                 */} 
                    <Label>{translate.header_course_changes_comment}</Label>
                    <Input id='alterationText' key='alterationText' type="textarea" value={this.state.values.alterationText} onChange={this.handleInputChange} />
                    <Label>{translate.header_analysis_edit_comment}</Label>
                    <Input id='commentChange' key='commentChange' type="textarea" value={this.state.values.commentChange} onChange={this.handleInputChange} />
                  </Col>  
                  <Col sm='3' className='col-temp'>
                    <Label>{translate.header_upload_file}</Label>
                    <FilePond id="analysis" key="analysis" 
                      labelIdle={labelIdle} 
                      ref={ref => (this.pond = ref)}
                      files={this.state.analysisFile}
                      allowMultiple={true}
                      maxFiles={1}
                      onupdatefiles={fileItems => {
                        this.setState({
                          analysisFile: fileItems.map(fileItem => fileItem.file)
                        })
                      }}
                   />
                    <Label>{translate.header_upload_file_pm}</Label>
                    <FilePond id="pm" key="pm" labelIdle={labelIdle}
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
                    />
                  </Col>
                </Row>
                <Row className="button-container text-center" >
                  <Col sm="4">
                    <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                     <div className="iconContainer arrow-back"/> {translate.btn_back }
                    </Button>
                  </Col>
                  <Col sm="4">
                    <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                    {translate.btn_cancel}
                    </Button>
                  </Col>
                  <Col sm="4">
                    <Button color='success' id='preview' key='preview' onClick={this.handlePreview} >
                      {translate.btn_preview}
                    </Button>
                  </Col>
                </Row>
              </Form>
              : <p></p>
            }
            { this.state.isPreviewMode
              ? <Row className="button-container text-center" >
                <Col sm="4">
                  <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                   <div className="iconContainer arrow-back"/>  {translate.btn_back_edit }
                  </Button>
                </Col>
                <Col sm="4">
                  <Button color='secondary' id='cancel' key='cancel' onClick={this.toggleModal} >
                    {translate.btn_cancel}
                  </Button>
                </Col>
                <Col sm="2">
                  {this.state.isPublished
                    ? ''
                    : <Button color='success' id='save' key='save' onClick={this.handleSave} >
                      {translate.btn_save}
                    </Button>
                  }
                </Col>
                <Col sm="2">
                  <Button color='success' id='publish' key='publish' onClick={this.toggleModal} >
                    {translate.btn_publish}
                  </Button>
                 
                </Col>
                <InfoModal type = 'publish' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.publish} id={this.props.routerStore.analysisId} handleConfirm={this.handlePublish} infoText={translate.info_publish}/>
                <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={this.props.routerStore.analysisId} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
              </Row>
              : ''
            }
            </Col>
          </Row>
          <InfoModal type = 'publish' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.publish} id={this.props.routerStore.analysisId} handleConfirm={this.handlePublish} infoText={translate.info_publish}/>
          <InfoModal type = 'cancel' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.cancel} id={this.props.routerStore.analysisId} handleConfirm={this.handleCancel} infoText={translate.info_cancel}/>
        </div>
      )
  }
}

export default AdminPage
