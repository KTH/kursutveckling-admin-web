import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert } from 'reactstrap'
import { ProgressBar } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'

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

import loader from '../../../img/*.gif'

const ALTERATION_TEXT_MAX = 2000

@inject(['routerStore'])
@observer
class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      saved:
        this.props.routerStore.analysisData !== undefined && this.props.routerStore.analysisData.changedDate.length > 2,
      values: this.props.routerStore.analysisData,
      isPublished: this.props.routerStore.analysisData
        ? this.props.routerStore.analysisData.isPublished
        : this.props.routerStore.status === 'published',
      progress: this.props.routerStore.status === 'new' ? 'new' : 'edit',
      isPreviewMode: this.props.routerStore.status === 'preview',
      activeSemester: '',
      changedStatus: false,
      modalOpen: {
        publish: false,
        cancel: false,
      },
      alert: '',
      alertSuccess: '',
      madatoryMessage: '',
      analysisFile: this.props.routerStore.analysisData ? this.props.routerStore.analysisData.analysisFileName : '',
      hasNewUploadedFileAnalysis: false,
      notValid: { mandatoryFields: [], overMaxFields: [], wrongFileTypeFields: [] },
      fileProgress: {
        analysis: 0,
      },
      statisticsParams: {
        endDate:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.endDate
            ? this.props.routerStore.analysisData.endDate
            : '',
        ladokId:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.ladokUIDs
            ? this.props.routerStore.analysisData.ladokUIDs
            : [],
      },
      endDateInputEnabled: true,
      examinationGradeInputEnabled: true,
      ladokLoading: false,
      multiLineAlert: handleMultiLineAlert({
        init: !this.props.routerStore.analysisData,
        messages: i18n.messages[props.routerStore.language].messages,
        ladokId:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.ladokUIDs
            ? this.props.routerStore.analysisData.ladokUIDs
            : [],
        endDate:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.endDate
            ? this.props.routerStore.analysisData.endDate
            : '',
        examinationGrade:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.examinationGrade
            ? this.props.routerStore.analysisData.examinationGrade
            : -1,
        endDateLadok:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.endDateLadok
            ? this.props.routerStore.analysisData.endDateLadok
            : '',
        examinationGradeLadok:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.examinationGradeLadok >= 0
            ? this.props.routerStore.analysisData.examinationGradeLadok
            : -1,
        alterationText:
          this.props.routerStore.analysisData && this.props.routerStore.analysisData.alterationText
            ? this.props.routerStore.analysisData.alterationText
            : '',
      }),
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
    this.handleNewExaminationGrade = this.handleNewExaminationGrade.bind(this)
    this.resolveMultiLineAlert = this.resolveMultiLineAlert.bind(this)
  }

  //*********************************  FILE UPLOAD  ********************************* */
  //********************************************************************************** */

  async hanleUploadFile(id, file, e) {
    if (e.target.files[0].type === 'application/pdf') {
      response = await this.sendRequest(id, file, e)
    } else {
      this.setState(prevState => {
        const notValid = {
          ...prevState.notValid,
          wrongFileTypeFields: [...prevState.notValid.wrongFileTypeFields, 'analysisFile'],
        }
        return {
          notValid,
          // alertError: i18n.messages[this.props.routerStore.language].messages.alert_not_pdf,
        }
      })
    }
  }

  sendRequest(id, file, e) {
    const thisInstance = this
    const fileProgress = this.state.fileProgress
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
          this.setState({ fileProgress: fileProgress })
        }
      })

      req.onreadystatechange = function () {
        let values = thisInstance.state.values
        if (this.readyState == 4 && this.status == 200) {
          values.pdfAnalysisDate = getTodayDate()
          fileProgress.analysis = 0
          thisInstance.setState(prevState => {
            const { mandatoryFields, wrongFileTypeFields } = prevState.notValid
            const mandatoryFieldsIndex = mandatoryFields.indexOf('analysisFile')
            if (mandatoryFieldsIndex > -1) {
              mandatoryFields.splice(mandatoryFieldsIndex, 1)
            }
            const wrongFileTypeFieldsIndex = wrongFileTypeFields.indexOf('analysisFile')
            if (wrongFileTypeFieldsIndex > -1) {
              wrongFileTypeFields.splice(wrongFileTypeFieldsIndex, 1)
            }
            return {
              analysisFile: this.responseText,
              alertSuccess: i18n.messages[thisInstance.props.routerStore.language].messages.alert_uploaded_file,
              values: values,
              hasNewUploadedFileAnalysis: true,
              notValid: { ...prevState.notValid, mandatoryFields, wrongFileTypeFields },
            }
          })
        }
      }

      let formData = new FormData()
      const data = this.getMetadata(this.state.isPublished ? 'published' : this.state.saved ? 'draft' : 'new')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('analysis', data.analysis)
      formData.append('status', data.status)
      req.open(
        'POST',
        `${this.props.routerStore.browserConfig.hostUrl}${
          this.props.routerStore.paths.storage.saveFile.uri.split(':')[0]
        }${this.props.routerStore.analysisData._id}/${id}/${this.state.isPublished}`
      )
      req.send(formData)
    })
  }

  getMetadata(status) {
    return {
      courseCode: this.state.values.courseCode,
      analysis: this.state.values._id,
      status,
    }
  }

  handleRemoveFile(event) {
    if (event.target.id === 'remove_analysis') this.setState({ analysisFile: '', hasNewUploadedFileAnalysis: true })
  }

  //***************************** BUTTON CLICK HANDLERS ****************************** */
  //********************************************************************************** */

  handlePreview(event) {
    event.preventDefault()
    const invalidData = { ...this.state.notValid, ...this.validateData(this.state.values) }

    if (
      invalidData.mandatoryFields.length > 0 ||
      invalidData.overMaxFields.length > 0 ||
      invalidData.wrongFileTypeFields.length > 0
    ) {
      this.setState({
        notValid: invalidData,
        // alertError: i18n.messages[this.props.routerStore.language].messages.alert_empty_fields,
      })
    } else {
      this.setState({
        isPreviewMode: true,
        progress: 'preview',
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
      if (routerStore.semesters.length === 0) {
        return routerStore
          .getCourseInformation(routerStore.courseCode, routerStore.user, routerStore.language)
          .then(courseData => {
            thisAdminPage.setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: routerStore.analysisData.semester,
              analysisFile: '',
              alert: '',
              multiLineAlert: [],
            })
          })
      }
      this.setState({
        isPreviewMode: false,
        progress: 'back_new',
        activeSemester: routerStore.analysisData.semester,
        alert: '',
        multiLineAlert: [],
        endDateInputEnabled: true,
        examinationGradeInputEnabled: true,
        endDateLadok: '',
        examinationGradeLadok: '-1',
      })
    }
    if (this.state.isPreviewMode) {
      this.setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: '',
        multiLineAlert: [],
      })
    }
  }

  handleCancel(event) {
    window.location = `${SERVICE_URL.admin}${this.props.routerStore.analysisData.courseCode}?serv=kutv&event=cancel`
  }

  handleSave(event) {
    event.preventDefault()
    const postObject = this.state.values
    const thisInstance = this
    const { routerStore } = this.props

    if (this.state.analysisFile !== postObject.analysisFileName) {
      postObject.analysisFileName = this.state.analysisFile
    }

    if (!this.state.saved && this.state.analysisFile.length > 0) {
      routerStore.updateFileInStorage(this.state.analysisFile, this.getMetadata('draft'))
    }

    if (this.state.statisticsParams && this.state.statisticsParams.ladokId) {
      postObject.ladokUIDs = this.state.statisticsParams.ladokId ? this.state.statisticsParams.ladokId : []
    }

    postObject.courseName = routerStore.courseTitle.name

    return routerStore.postRoundAnalysisData(postObject, postObject.changedDate.length === 0).then(data => {
      const { roundNamesWithMissingMemos } = routerStore
      if (this.state.isPreviewMode) {
        window.location = encodeURI(
          `${routerStore.browserConfig.hostUrl}${SERVICE_URL.admin}${
            routerStore.analysisData.courseCode
          }?serv=kutv&event=save&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${
            routerStore.analysisData.analysisName
          }${roundNamesWithMissingMemos ? '&noMemo=' + roundNamesWithMissingMemos : ''}`
        ) // term=, name=
      } else {
        thisInstance.setState({
          saved: true,
          progress: 'edit',
          alertSuccess: i18n.messages[routerStore.language].messages.alert_saved_draft,
          hasNewUploadedFileAnalysis: false,
          values: data,
        })
        thisInstance.props.history.push(
          thisInstance.props.routerStore.browserConfig.proxyPrefixPath.uri +
            '/' +
            thisInstance.props.routerStore.analysisId
        )
      }
    })
  }

  handlePublish(event, fromModal = false) {
    if (!fromModal) {
      event.preventDefault()
    }
    const { routerStore } = this.props
    const thisInstance = this
    let postObject = this.state.values
    let modal = this.state.modalOpen

    if (postObject.isPublished) {
      postObject.changedAfterPublishedDate = new Date().toISOString()
    } else {
      if (this.state.statisticsParams && this.state.statisticsParams.ladokId) {
        postObject.ladokUIDs = this.state.statisticsParams.ladokId ? this.state.statisticsParams.ladokId : []
      }
      postObject.publishedDate = new Date().toISOString()
      postObject.isPublished = true
    }

    postObject.courseName = routerStore.courseTitle.name
    postObject.analysisFileName = this.state.analysisFile

    return this.props.routerStore
      .postRoundAnalysisData(postObject, this.props.routerStore.status === 'new')
      .then(response => {
        modal.publish = false
        if (response === undefined || response.message) {
          this.setState({
            alert: response.message ? response.message : 'No connection with data base',
            modalOpen: modal,
          })
        } else {
          thisInstance.setState({
            saved: true,
            isPublished: true,
            modalOpen: modal,
            values: response,
          })
          const { roundNamesWithMissingMemos } = routerStore

          window.location = encodeURI(
            `${routerStore.browserConfig.hostUrl}${SERVICE_URL.admin}${
              routerStore.analysisData.courseCode
            }?serv=kutv&event=pub&id=${routerStore.analysisId}&term=${routerStore.analysisData.semester}&name=${
              routerStore.analysisData.analysisName
            }${roundNamesWithMissingMemos ? '&noMemo=' + roundNamesWithMissingMemos : ''}`
          )
        }
      })
  }

  handleNewExaminationGrade(newEndDate) {
    this.setState({ ladokLoading: true })
    const { values, statisticsParams, modalOpen } = this.state
    if (newEndDate.length > 0) {
      return this.props.routerStore
        .postLadokRoundIdListAndDateToGetStatistics(statisticsParams.ladokId, newEndDate)
        .then(ladokResponse => {
          values.examinationGrade = Math.round(Number(this.props.routerStore.statistics.examinationGrade) * 10) / 10
          values.examinationGradeFromLadok =
            values['endDate'] === values['endDateLadok'] &&
            Number(values['examinationGrade']) === values['examinationGradeLadok']
          const multiLineAlert = handleMultiLineAlert({
            messages: i18n.messages[this.props.routerStore.language].messages,
            ladokId: statisticsParams.ladokId,
            endDate: values.endDate,
            examinationGrade: values.examinationGrade,
            endDateLadok: values.endDateLadok,
            examinationGradeLadok: values.examinationGradeLadok,
          })
          this.setState(state => {
            return {
              values,
              examinationGradeInputEnabled: true,
              ladokLoading: false,
              alert: values.examinationGradeFromLadok ? '' : state.alert,
              multiLineAlert,
            }
          })
        })
    } else {
      values.examinationGrade = -1
      values.examinationGradeFromLadok = false
      this.setState({
        values,
        ladokLoading: false,
      })
    }
  }

  //************************ OTHER **************************** */
  //*************************************************************/

  editMode(semester, rounds, analysisId, status, tempData, statisticsParams) {
    const thisAdminPage = this

    if (status === 'new') {
      return this.props.routerStore
        .postLadokRoundIdListAndDateToGetStatistics(statisticsParams.ladokId, statisticsParams.endDate)
        .then(ladokResponse => {
          this.props.routerStore.createAnalysisData(semester, rounds).then(data => {
            const valuesObject = this.handleTemporaryData(thisAdminPage.props.routerStore.analysisData, tempData)
            const multiLineAlert = handleMultiLineAlert({
              messages: i18n.messages[this.props.routerStore.language].messages,
              ladokId: statisticsParams.ladokId,
              endDate: valuesObject.values.endDate,
              examinationGrade: valuesObject.values.examinationGrade,
              endDateLadok: valuesObject.values.endDateLadok,
              examinationGradeLadok: valuesObject.values.examinationGradeLadok,
            })
            thisAdminPage.setState({
              progress: 'edit',
              isPreviewMode: false,
              isPublished: false,
              values: valuesObject.values,
              activeSemester: semester,
              analysisFile: valuesObject.files.analysisFile,
              alert: '',
              statisticsParams,
              multiLineAlert,
            })
          })
        })
    } else {
      this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri + '/' + analysisId)
      return thisAdminPage.props.routerStore.getRoundAnalysis(analysisId).then(analysis => {
        const valuesObject = this.handleTemporaryData(thisAdminPage.props.routerStore.analysisData, tempData)
        const statisticsParams = {}
        statisticsParams.endDate = valuesObject.values.endDate
        statisticsParams.ladokId = valuesObject.values.ladokUIDs ? valuesObject.values.ladokUIDs : []
        const multiLineAlert = handleMultiLineAlert({
          messages: i18n.messages[this.props.routerStore.language].messages,
          ladokId: valuesObject.values.ladokUIDs,
          endDate: valuesObject.values.endDate,
          examinationGrade: valuesObject.values.examinationGrade,
          endDateLadok: valuesObject.values.endDateLadok,
          examinationGradeLadok: valuesObject.values.examinationGradeLadok,
        })
        const endDateInputEnabled = !valuesObject.values.ladokUIDs || !!valuesObject.values.endDate
        thisAdminPage.setState({
          progress: 'edit',
          isPreviewMode: false,
          isPublished: thisAdminPage.props.routerStore.analysisData.isPublished,
          values: valuesObject.values,
          analysisFile: valuesObject.files.analysisFile,
          saved: true,
          statisticsParams,
          alert: '',
          multiLineAlert,
          endDateInputEnabled,
        })
      })
    }
  }

  toggleModal(event) {
    let modalOpen = this.state.modalOpen
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    this.setState({
      modalOpen: modalOpen,
    })
  }

  handleInputChange(event) {
    let values = this.state.values
    let endDateInputEnabled = this.state.endDateInputEnabled
    let examinationGradeInputEnabled = this.state.examinationGradeInputEnabled
    values[event.target.id] = event.target.value
    if (
      event.target.id === 'examinationGrade' ||
      event.target.id === 'registeredStudents' ||
      event.target.id === 'endDate'
    ) {
      if (this.state.values[event.target.id + 'FromLadok']) {
        values[event.target.id + 'FromLadok'] = Number(values[event.target.id]) === values[event.target.id + 'Ladok']
      }
    }

    if (event.target.id === 'examinationGrade' && this.state.statisticsParams.ladokId.length > 0) {
      if (Number(values['examinationGrade']) === values['examinationGradeLadok']) {
        values['endDate'] = values['endDateLadok']
        endDateInputEnabled = true
      } else {
        values['endDate'] = ''
        endDateInputEnabled = false
      }
    } else if (event.target.id === 'endDate' && this.state.statisticsParams.ladokId.length > 0) {
      this.handleNewExaminationGrade(values['endDate'])
      examinationGradeInputEnabled = false
    }

    const multiLineAlert = handleMultiLineAlert({
      messages: i18n.messages[this.props.routerStore.language].messages,
      ladokId: this.state.statisticsParams.ladokId,
      endDate: values.endDate,
      examinationGrade: values.examinationGrade,
      endDateLadok: values.endDateLadok,
      examinationGradeLadok: values.examinationGradeLadok,
    })

    const invalidData = { ...this.state.notValid, ...this.validateData(this.state.values) }

    this.setState({
      endDateInputEnabled: endDateInputEnabled,
      examinationGradeInputEnabled: examinationGradeInputEnabled,
      values: values,
      notValid: invalidData,
      multiLineAlert: multiLineAlert,
    })
  }

  validateData(values) {
    let invalidData = { mandatoryFields: [], overMaxFields: [] }
    const toValidate = ['registeredStudents', 'examiners', 'responsibles']
    for (let key of toValidate) {
      if (values[key].length === 0) {
        invalidData.mandatoryFields.push(key)
      }
    }

    const examinationGradeValue = values['examinationGrade']
    if (examinationGradeValue.length === 0 || examinationGradeValue === '-1') {
      invalidData.mandatoryFields.push('examinationGrade')
    }

    if (!this.state.analysisFile.length) {
      invalidData.mandatoryFields.push('analysisFile')
    } else {
      if (!isValidDate(values.pdfAnalysisDate)) {
        invalidData.mandatoryFields.push('pdfAnalysisDate')
      }
    }

    if (this.state.isPublished && values.commentChange.length === 0) {
      invalidData.mandatoryFields.push('commentChange')
    }

    const alterationTextLength = values['alterationText'] ? values['alterationText'].length : 0
    if (alterationTextLength > ALTERATION_TEXT_MAX) {
      invalidData.overMaxFields.push('alterationText')
    }

    return invalidData
  }

  getTempData() {
    if (this.state.progress === 'back_new') {
      const { alterationText, examinationGrade, registeredStudents, roundIdList } = this.state.values
      const { analysisFile, statisticsParams } = this.state
      return {
        alterationText,
        examinationGrade,
        registeredStudents,
        roundIdList,
        analysisFile,
        statisticsParams,
      }
    }
    return null
  }

  handleTemporaryData(valueObject, tempData) {
    let returnObject = {
      values: valueObject,
      files: {
        analysisFile: '',
      },
    }
    if (tempData) {
      returnObject.values.alterationText = tempData.alterationText
      returnObject.values.registeredStudents = tempData.registeredStudents
      returnObject.values.examinationGrade = tempData.examinationGrade
      returnObject.files.analysisFile = tempData.analysisFile
    } else {
      if (valueObject) {
        returnObject.files.analysisFile = valueObject.analysisFileName
      }
    }
    return returnObject
  }

  resolveMultiLineAlert() {
    const language = this.props.routerStore.language
    const messages = i18n.messages[language].messages

    const ladokId = this.state.statisticsParams.ladokId
    const endDate = this.state.values.endDate
    const examinationGrade = this.state.values.examinationGrade
    const endDateLadok = this.state.values.endDateLadok
    const examinationGradeLadok = this.state.values.examinationGradeLadok

    return handleMultiLineAlert({
      messages,
      ladokId,
      endDate,
      examinationGrade,
      endDateLadok,
      examinationGradeLadok,
    })
  }

  componentDidUpdate() {
    const thisInstance = this
    if (thisInstance.state.alertSuccess.length > 0) {
      setTimeout(() => {
        thisInstance.setState({ alertSuccess: '' })
      }, 5000)
    }
  }

  render() {
    const { routerStore } = this.props
    const { isPublished, fileProgress } = this.state
    const translate = i18n.messages[routerStore.language].messages

    if (routerStore.analysisData === undefined || this.state.progress === 'back_new')
      return (
        <div ref={this.divTop}>
          {routerStore.errorMessage.length === 0 ? (
            <div>
              <Title
                title={routerStore.courseTitle}
                language={routerStore.language}
                courseCode={routerStore.courseCode}
                header={translate.header_main[routerStore.status]}
              />
              <ProgressBar active={1} pages={translate.pagesProgressBar} />

              {/************************************************************************************* */}
              {/*                               PAGE1: ANALYSIS MENU                                  */}
              {/************************************************************************************* */}
              {routerStore.semesters.length === 0 ? (
                <Alert color="info" className="alert-margin">
                  {' '}
                  {translate.alert_no_rounds}{' '}
                </Alert>
              ) : (
                <AnalysisMenu
                  editMode={this.editMode}
                  semesterList={routerStore.semesters}
                  roundList={routerStore.roundData}
                  progress={this.state.progress}
                  activeSemester={this.state.activeSemester}
                  firstVisit={routerStore.analysisData === undefined}
                  status={routerStore.status}
                  tempData={/*this.state.saved ? {} : */ this.getTempData()}
                  saved={this.state.values && this.state.values.changedDate.length > 0}
                  analysisId={this.state.saved && this.state.values ? this.state.values._id : ''}
                />
              )}
            </div>
          ) : (
            <Alert className="alert-margin" color="info">
              {' '}
              {routerStore.errorMessage}
            </Alert>
          )}
        </div>
      )
    else
      return (
        <div
          key="kursutveckling-form-container"
          className="container"
          id="kursutveckling-form-container"
          ref={ref => (this._div = ref)}
        >
          {/************************************************************************************* */}
          {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                              */}
          {/************************************************************************************* */}
          {routerStore.errorMessage.length > 0 ? (
            <Alert color="info" className="alert-margin">
              {routerStore.errorMessage}
            </Alert>
          ) : (
            <div>
              <Title
                title={routerStore.courseTitle}
                language={routerStore.language}
                courseCode={routerStore.courseCode}
                header={translate.header_main[routerStore.status]}
              />
              {routerStore.status !== 'preview' && (
                <ProgressBar active={this.state.progress === 'edit' ? 2 : 3} pages={translate.pagesProgressBar} />
              )}

              {/************************************************************************************* */}
              {/*                                   PREVIEW                                           */}
              {/************************************************************************************* */}
              {this.state.values && this.state.isPreviewMode ? (
                <Preview values={this.state.values} analysisFile={this.state.analysisFile} />
              ) : (
                ''
              )}
              <Row key="form" id="form-container">
                <Col sm="12" lg="12">
                  {/************************************************************************************* */}
                  {/*                                 EDIT FORM                                           */}
                  {/************************************************************************************* */}

                  {this.state.values && !this.state.isPreviewMode ? (
                    <Form className="admin-form">
                      {/* ----- Intro text for Edit ------- */}
                      <div>
                        <p>{translate.intro_edit}</p>
                      </div>

                      {/* ---- Semester and name of analysis ---- */}
                      <h2>{translate.header_edit_content}</h2>
                      <p>
                        {' '}
                        <b>{translate.header_semester} </b>
                        {`${translate.course_short_semester[this.state.values.semester.toString().match(/.{1,4}/g)[1]]} 
                  ${this.state.values.semester.toString().match(/.{1,4}/g)[0]}`}
                        <b> {translate.header_course_offering}</b> {this.state.values.analysisName}
                      </p>

                      <p>{translate.header_mandatory_fields}</p>

                      {/* ----- ALERTS ----- */}
                      {this.state.alert.length > 0 && (
                        <Row>
                          <Alert color="info" className="alert-margin">
                            {this.state.alert}{' '}
                          </Alert>
                        </Row>
                      )}
                      {this.state.multiLineAlert.length > 0 && (
                        <Row>
                          <Alert color="info" className="alert-margin">
                            {this.state.multiLineAlert.map((text, index) => (
                              <p key={'alert-p-' + index}>{text}</p>
                            ))}
                          </Alert>
                        </Row>
                      )}
                      {this.state.alertSuccess.length > 0 && (
                        <Row>
                          <Alert color="success">{this.state.alertSuccess} </Alert>
                        </Row>
                      )}
                      <AlertError
                        notValid={this.state.notValid}
                        translations={i18n.messages[this.props.routerStore.language]}
                      />
                      {/* FORM - FIRST COLUMN */}
                      <Row className="form-group">
                        <Col sm="4" className="col-form">
                          <h4>{translate.header_upload}</h4>

                          {/** ------ ANALYSIS-FILE UPLOAD ------- **/}
                          <FormLabel
                            translate={translate}
                            header={'header_upload_file'}
                            id={'info_upload_course_analysis'}
                          />
                          <UpLoad
                            id="analysis"
                            key="analysis"
                            handleUpload={this.hanleUploadFile}
                            progress={fileProgress.analysis}
                            path={routerStore.browserConfig.proxyPrefixPath.uri}
                            file={this.state.analysisFile}
                            notValid={this.state.notValid}
                            handleRemoveFile={this.handleRemoveFile}
                            type="analysisFile"
                          />
                          {this.state.analysisFile.length > 0 && (
                            <span>
                              <FormLabel
                                translate={translate}
                                header={'header_upload_file_date'}
                                id={'info_upload_course_analysis_date'}
                              />
                              <Input
                                id="pdfAnalysisDate"
                                key="pdfAnalysisDate"
                                type="date"
                                value={this.state.values.pdfAnalysisDate}
                                onChange={this.handleInputChange}
                                className={
                                  this.state.notValid.mandatoryFields.includes('pdfAnalysisDate') ? 'not-valid ' : ''
                                }
                                style={{ maxWidth: '180px' }}
                              />
                            </span>
                          )}

                          <br />
                        </Col>

                        {/* ------ FORM - SECOND COLUMN ------ */}
                        <Col sm="4" className="col-form">
                          <h4>{translate.header_summarize}</h4>

                          <FormLabel
                            translate={translate}
                            header={'header_course_changes_comment'}
                            id={'info_course_changes_comment'}
                            badgeText={
                              this.state.values.alterationText.length > ALTERATION_TEXT_MAX
                                ? this.state.values.alterationText.length
                                : ''
                            }
                          />
                          <Input
                            style={{ height: 300 }}
                            id="alterationText"
                            key="alterationText"
                            type="textarea"
                            value={this.state.values.alterationText}
                            onChange={this.handleInputChange}
                            className={this.state.notValid.overMaxFields.includes('alterationText') ? 'not-valid' : ''}
                          />
                        </Col>

                        {/* ------ FORM - THIRD COLUMN -------- */}
                        <Col sm="4" className="col-form">
                          <h4>{translate.header_check_data}</h4>

                          <FormLabel translate={translate} header={'header_examiners'} id={'info_examiners'} />
                          <Input
                            id="examiners"
                            key="examiners"
                            type="text"
                            value={this.state.values.examiners}
                            onChange={this.handleInputChange}
                            className={this.state.notValid.mandatoryFields.includes('examiners') ? 'not-valid' : ''}
                          />

                          <FormLabel translate={translate} header={'header_responsibles'} id={'info_responsibles'} />
                          <Input
                            id="responsibles"
                            key="responsibles"
                            type="text"
                            value={this.state.values.responsibles}
                            onChange={this.handleInputChange}
                            className={this.state.notValid.mandatoryFields.includes('responsibles') ? 'not-valid' : ''}
                          />

                          <FormLabel translate={translate} header={'header_registrated'} id={'info_registrated'} />
                          <Input
                            id="registeredStudents"
                            key="registeredStudents"
                            type="number"
                            placeholder="0"
                            value={this.state.values.registeredStudents}
                            onChange={this.handleInputChange}
                            className={
                              this.state.notValid.mandatoryFields.includes('registeredStudents') ? 'not-valid' : ''
                            }
                          />

                          <FormLabel
                            translate={translate}
                            header={'header_examination_grade'}
                            id={'info_examination_grade'}
                          />
                          <div className="calculate-examination-grade">
                            <div>
                              <h5>{translate.header_end_date}</h5>
                              <Input
                                id="endDate"
                                key="endDate"
                                type="date"
                                value={this.state.values.endDate}
                                onChange={this.handleInputChange}
                                className={this.state.notValid.mandatoryFields.includes('endDate') ? 'not-valid' : ''}
                                disabled={this.state.endDateInputEnabled ? '' : 'disabled'}
                                max="2099-12-31"
                              />
                            </div>
                            <div>
                              <h5>{translate.header_result}</h5>
                              <span>
                                {this.state.ladokLoading === true ? (
                                  <span className="ladok-loading-progress-inline">
                                    <img title="loading file" src={loader['ajax-loader']} />
                                  </span>
                                ) : (
                                  ''
                                )}
                                <Input
                                  id="examinationGrade"
                                  key="examinationGrade"
                                  type="number"
                                  placeholder="0"
                                  value={this.state.values.examinationGrade}
                                  onChange={this.handleInputChange}
                                  className={
                                    this.state.notValid.mandatoryFields.includes('examinationGrade') ? 'not-valid' : ''
                                  }
                                  disabled={this.state.examinationGradeInputEnabled ? '' : 'disabled'}
                                />
                              </span>
                            </div>
                          </div>

                          {isPublished ? (
                            <span>
                              <div className="inline-flex">
                                <h4>{translate.header_analysis_edit_comment}</h4>
                                <InfoButton
                                  addClass="padding-top-30"
                                  id="info_edit_comments"
                                  textObj={translate.info_edit_comments}
                                />
                              </div>
                              <Input
                                id="commentChange"
                                key="commentChange"
                                type="textarea"
                                value={this.state.values.commentChange}
                                onChange={this.handleInputChange}
                                className={
                                  this.state.notValid.mandatoryFields.indexOf('commentChange') > -1 ? 'not-valid' : ''
                                }
                              />
                            </span>
                          ) : (
                            ''
                          )}
                        </Col>
                      </Row>
                    </Form>
                  ) : (
                    ''
                  )}
                  {/************************************************************************************* */}
                  {/*                                BUTTONS FOR PAG 2 AND 3                              */}
                  {/************************************************************************************* */}
                  {this.state.isPreviewMode &&
                  this.state.values.changedDate.length > 0 &&
                  routerStore.status !== 'preview' &&
                  routerStore.analysisId ? (
                    <CopyText
                      textToCopy={
                        routerStore.browserConfig.hostUrl +
                        routerStore.browserConfig.proxyPrefixPath.uri +
                        '/preview/' +
                        routerStore.analysisId +
                        '?title=' +
                        encodeURI(routerStore.courseTitle.name + '_' + routerStore.courseTitle.credits)
                      }
                      header={translate.header_copy_link}
                    />
                  ) : (
                    ''
                  )}

                  <Row className="button-container text-center">
                    <Col sm="4" className="align-left-sm-center">
                      {routerStore.status === 'preview' ? (
                        ''
                      ) : (
                        <Button className="back" color="secondary" id="back" key="back" onClick={this.handleBack}>
                          {this.state.isPreviewMode ? translate.btn_back_edit : translate.btn_back}
                        </Button>
                      )}
                    </Col>
                    <Col sm="3" className="align-right-sm-center">
                      {routerStore.status !== 'preview' && (
                        <Button color="secondary" id="cancel" key="cancel" onClick={this.toggleModal}>
                          {translate.btn_cancel}
                        </Button>
                      )}
                    </Col>
                    <Col sm="3">
                      {this.state.isPublished || routerStore.status === 'preview' ? (
                        ''
                      ) : (
                        <Button color="secondary" id="save" key="save" onClick={this.handleSave}>
                          {this.state.isPreviewMode ? translate.btn_save_and_cancel : translate.btn_save}
                        </Button>
                      )}
                    </Col>
                    <Col sm="2">
                      {routerStore.status !== 'preview' && (
                        <span>
                          {this.state.isPreviewMode ? (
                            <Button color="success" id="publish" key="publish" onClick={this.toggleModal}>
                              {translate.btn_publish}
                            </Button>
                          ) : (
                            <Button
                              className="next"
                              color="success"
                              id="preview"
                              key="preview"
                              onClick={this.handlePreview}
                            >
                              {translate.btn_preview}
                            </Button>
                          )}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/************************************************************************************* */}
              {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
              {/************************************************************************************* */}
              <InfoModal
                type="publish"
                toggle={this.toggleModal}
                isOpen={this.state.modalOpen.publish}
                id={this.props.routerStore.analysisId}
                handleConfirm={this.handlePublish}
                infoText={translate.info_publish}
              />
              <InfoModal
                type="cancel"
                toggle={this.toggleModal}
                isOpen={this.state.modalOpen.cancel}
                id={this.props.routerStore.analysisId}
                handleConfirm={this.handleCancel}
                infoText={translate.info_cancel}
              />
            </div>
          )}
        </div>
      )
  }
}

const handleMultiLineAlert = alertVariables => {
  const { init, messages, ladokId, endDate, examinationGrade, endDateLadok, examinationGradeLadok } = alertVariables
  const multiLineAlert = []

  // Automatic calculation of examination rate is possible
  if (ladokId && ladokId.length) {
    if (!(endDate === endDateLadok && Number(examinationGrade) === examinationGradeLadok)) {
      multiLineAlert.push(messages.alert_graduation_rate_fields_updated)
      multiLineAlert.push(
        messages.original_values_are + ' ' + endDateLadok + ' ' + messages.and + ' ' + examinationGradeLadok + '.'
      )
    }
    // Round is chosen, but automatic calculation of examination rate is not possible
  } else if (!init) {
    multiLineAlert.push(messages.alert_graduation_rate_cant_be_calculated)
  }
  return multiLineAlert
}

const FormLabel = ({ translate, header, id, badgeText }) => {
  return (
    <span className="inline-flex">
      <Label>
        {translate[header]} {badgeText ? <span className="badge badge-warning badge-pill">{badgeText}</span> : null}
      </Label>
      <InfoButton id={id} textObj={translate[id]} />
    </span>
  )
}

const AlertError = ({ notValid, translations }) => {
  const { mandatoryFields, overMaxFields, wrongFileTypeFields } = notValid
  const noOfErrorCategories =
    (mandatoryFields.length ? 1 : 0) + (overMaxFields.length ? 1 : 0) + (wrongFileTypeFields.length ? 1 : 0)
  if (!noOfErrorCategories) {
    return null
  }

  const errors =
    noOfErrorCategories === 1 ? (
      <>
        {!!mandatoryFields.length && <>{translations.messages.alert_empty_fields}</>}
        {!!overMaxFields.length && (
          <>
            {overMaxFields[0] === 'alterationText'
              ? translations.messages.alert_over_max_fields.alterationText
              : translations.messages.alert_over_max_fields.default}
          </>
        )}
        {!!wrongFileTypeFields.length && <>{translations.messages.alert_not_pdf}</>}
      </>
    ) : (
      <>
        {!!mandatoryFields.length && <li>{translations.messages.alert_empty_fields}</li>}
        {!!overMaxFields.length && (
          <li>
            {overMaxFields[0] === 'alterationText'
              ? translations.messages.alert_over_max_fields.alterationText
              : translations.messages.alert_over_max_fields.default}
          </li>
        )}
        {!!wrongFileTypeFields.length && <li>{translations.messages.alert_not_pdf}</li>}
      </>
    )

  const errorsBlock = noOfErrorCategories === 1 ? <>{errors}</> : <ul>{errors}</ul>

  return (
    <Row>
      <Alert color="danger">{errorsBlock}</Alert>
    </Row>
  )
}

export default AdminPage
