import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'
import { FilePond } from 'react-filepond'
import 'filepond/dist/filepond.min.css'

import i18n from '../../../../i18n/index'

//Components
import Title from '../components/Title'
import AnalysisMenue from '../components/AnalysisMenue'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal'

//Helpers 
import { EMPTY, ADMIN_URL } from '../util/constants'
const labelIdle = 'Drag & Drop filen här <span class="filepond--label-action"> eller öppna utforskaren </span>'

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
      modalOpen: false
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
      if (routerStore.semesters.length === 0)
        return routerStore.getCourseInformation(routerStore.analysisData.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: routerStore.analysisData.semester
            })
          })
      this.setState({
        isPreviewMode: false,
        progress: 'back_new',
        activeSemester: routerStore.analysisData.semester
      })
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + this.props.routerStore.courseData.courseCode)
    }
    if (this.state.isPreviewMode) {
      this.setState({
        isPreviewMode: false,
        progress: 'edit'
      })
    }
  }

  handleCancel(event) {
    event.preventDefault()
    alert('back to admin with status')
  }

  editMode(semester, rounds, analysisId, status) {
    const thisAdminPage = this

    if (status === 'new') {
      this.props.routerStore.createAnalysisData(semester, rounds)
      thisAdminPage.setState({
        progress: "edit",
        isPreviewMode: false,
        isPublished: false,
        values: thisAdminPage.props.routerStore.analysisData,
        activeSemester: semester
      })
    }
    else {
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + analysisId)
      return thisAdminPage.props.routerStore.getRoundAnalysis(analysisId).then(analysis => {
        thisAdminPage.setState({
          progress: 'preview',
          isPreviewMode: true,
          isPublished: thisAdminPage.props.routerStore.analysisData.isPublished,
          values: thisAdminPage.props.routerStore.analysisData
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
        thisInstance.setState({
          saved: true,
          progress: false,
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
    return this.props.routerStore.postRoundAnalysisData(postObject, false)
      .then((response) => {
        console.log('handlePublish', response)
        alert("back to kursinfo-admin")
        thisInstance.setState({
          saved: true,
          isPublished: true,
          modalOpen: false
        })
      })
  }

  toggleModal(){
    this.setState({
      modalOpen: !this.state.modalOpen
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
  console.log('componentDidMount')
  window.scrollTo(0, 0)
    this._div.scrollTop = 0
  }


  render() {
    const routerStore = this.props.routerStore
    const isDisabled = this.state.isPublished === true

    console.log("routerStore1", routerStore)
    console.log("this.state1", this.state)
    if (routerStore.analysisData === undefined || this.state.progress === 'back_new')
      return (
        <div ref={(ref) => this._div = ref}>
          <h1>{'KURSUTV...'}</h1>
          <Title title={routerStore.courseData.title} language={routerStore.language} courseCode={routerStore.courseData.courseCode} />
          {routerStore.semesters.length === 0
            ? <Alert>No rounds!</Alert>
            : <AnalysisMenue
              editMode={this.editMode}
              semesterList={routerStore.semesters}
              roundList={routerStore.roundData}
              progress={this.state.progress}
              activeSemester={this.state.activeSemester}
            />
          }
        </div>)
    else
      return (
        <div key='kursutveckling-form-container' className='container' id='kursutveckling-form-container' ref={(ref) => this._div = ref} >
          <h1>{'KURSUTV page...'}</h1>
          <Title title={undefined} language={routerStore.language} courseCode={routerStore.analysisData.courseCode} />
          <h3>{this.state.values.analysisName}</h3>
          {this.state.values
            ? <Preview values={this.state.values} />
            : <p>waiting</p>
          }
          <Row key='form' id='form-container'>
            {this.state.saved ?
              <Alert>
                Finimangsparat
            </Alert>
              : ''}
            {this.state.values && !this.state.isPreviewMode
              ? <Form className='admin-form'>
                <Row className='form-group'>
                  <Col sm='5' className='col-temp'>
                    <Label>round name</Label>
                    <Input id='analysisName' key='round' type='text' value={this.state.values.analysisName} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>Programmes</Label>
                    <Input id='programmeCodes' key='programmeCodes' type='text' value={this.state.values.programmeCodes} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>examiners</Label>
                    <Input id='examiners' key='examiners' type='text' value={this.state.values.examiners} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>responsibles</Label>
                    <Input id='responsibles' key='responsibles' type='text' value={this.state.values.responsibles} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>examinationRounds</Label>
                    <Input id='examinationRounds' key='examinationRounds' type="textarea" value={this.state.values.examinationRounds} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>registered students</Label>
                    <Input id='registeredStudents' key='registeredStudents' type='text' value={this.state.values.registeredStudents} onChange={this.handleInputChange} disabled={isDisabled} />
                    <Label>examinationGrade</Label>
                    <Input id='examinationGrade' key='examinationGrade' type='number' value={this.state.values.examinationGrade} onChange={this.handleInputChange} disabled={isDisabled} />
                  </Col>
                  <Col sm='5' className='col-temp'>

                    <Label>alteration text (max xxx tecken)</Label>
                    <Input id='alterationText' key='alterationText' type="textarea" value={this.state.values.alterationText} onChange={this.handleInputChange} />
                    <Label>commentChange (max xxx tecken)</Label>
                    <Input id='commentChange' key='commentChange' type="textarea" value={this.state.values.commentChange} onChange={this.handleInputChange} />
                    <Label>commentExam</Label>
                    {this.state.values.commentExam && this.state.values.commentExam.length === 0
                      ? <Input id='commentExam' key='commentExam' type='textarea' value={this.state.values.commentExam} onChange={this.handleInputChange} disabled={isDisabled} />
                      : <p id='commentExam' key='commentExam' dangerouslySetInnerHTML={{ __html: this.state.values.commentExam }} />
                    }
                    <Label>upload analysis-pdf</Label>
                    <FilePond id="analysis" key="analysis" labelIdle={labelIdle} />
                    <Label>upload PM-file</Label>
                    <FilePond id="pm" key="pm" labelIdle={labelIdle} />
                  </Col>
                </Row>
                <Row className="button-container text-center" >
                  <Col sm="4">
                    <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                      {'Back'}
                    </Button>
                  </Col>
                  <Col sm="4">
                    <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                      {'Cancel'}
                    </Button>
                  </Col>
                  <Col sm="4">
                    <Button color='success' id='preview' key='preview' onClick={this.handlePreview} >
                      {'Preview'}
                    </Button>
                  </Col>
                </Row>

                {/** <Label>ID</Label>
                <Input id='_id' key='round' type='id' value={this.state.values._id} onChange={this.handleInputChange} disabled={isDisabled} />

                <Label>courseCode</Label>
                <Input id='courseCode' key='courseCode' type='text' value={this.state.values.courseCode} onChange={this.handleInputChange} disabled={isDisabled} />
                */}
              </Form>
              : <p></p>
            }
            {this.state.isPreviewMode
              ? <Row className="button-container text-center" >
                <Col sm="3">
                  <Button color='secondary' id='back' key='back' onClick={this.handleBack} >
                    {'Back'}
                  </Button>
                </Col>
                <Col sm="3">
                  <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                    {'Cancel'}
                  </Button>
                </Col>
                <Col sm="3">
                  {this.state.isPublished
                    ? ''
                    : <Button color='success' id='save' key='save' onClick={this.handleSave} >
                      {'Save'}
                    </Button>
                  }
                </Col>
                <Col sm="3">
                  <Button color='success' id='publish' key='publish' onClick={this.toggleModal} >
                    {'Publish'}
                  </Button>
                  <InfoModal toggle= {this.toggleModal} isOpen = {this.state.modalOpen} id={this.props.routerStore.analysisId} confirmLable={'publish_confirm'} handleConfirm={this.handlePublish} infoText={'publish_warning_text'}/>
                </Col>

              </Row>
              : ''
            }
          </Row>
        </div>
      )
  }
}

export default AdminPage
