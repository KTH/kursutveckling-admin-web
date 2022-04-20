import React, { useEffect, useReducer } from 'react'
import { Row, Col, Button, Form, Label, Input, Alert, Spinner } from 'reactstrap'
import { ProgressBar } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import { useWebContext } from '../context/WebContext'

// Components
import Title from '../components/Title'
import AnalysisMenu from '../components/AnalysisMenu'
import Preview from '../components/Preview'
import InfoModal from '../components/InfoModal'
import CopyText from '../components/CopyText'
import InfoButton from '../components/InfoButton'
import UpLoad from '../components/UpLoad'

// Helpers
import { SERVICE_URL } from '../util/constants'
import { getTodayDate, isValidDate } from '../util/helpers'
import i18n from '../../../../i18n/index'

const ALTERATION_TEXT_MAX = 2000

function validateData(state, fieldId = null) {
  const { analysisFile, isPublished, values } = state
  const invalidData = { mandatoryFields: [], overMaxFields: [] }
  const toValidate = fieldId ? [fieldId] : ['registeredStudents', 'examiners', 'responsibles']
  for (let key of toValidate) {
    if (values[key].length === 0) {
      invalidData.mandatoryFields.push(key)
    }
  }

  const { alterationText, examinationGrade: examinationGradeValue } = values
  if (examinationGradeValue.length === 0 || examinationGradeValue === '-1') {
    invalidData.mandatoryFields.push('examinationGrade')
  }

  if (!analysisFile.length) {
    invalidData.mandatoryFields.push('analysisFile')
  } else if (!isValidDate(values.pdfAnalysisDate)) {
    invalidData.mandatoryFields.push('pdfAnalysisDate')
  }

  if (isPublished && values.commentChange.length === 0) {
    invalidData.mandatoryFields.push('commentChange')
  }

  const alterationTextLength = alterationText ? alterationText.length : 0
  if (alterationTextLength > ALTERATION_TEXT_MAX) {
    invalidData.overMaxFields.push('alterationText')
  }

  return invalidData
}

const handleMultiLineAlert = alertVariables => {
  const { init, messages, ladokId, endDate, examinationGrade, endDateLadok, examinationGradeLadok } = alertVariables
  const multiLineAlert = []

  // Automatic calculation of examination rate is possible
  if (ladokId && ladokId.length) {
    if (!(endDate === endDateLadok && Number(examinationGrade) === examinationGradeLadok)) {
      multiLineAlert.push(messages.alert_graduation_rate_fields_updated)
      multiLineAlert.push(`${messages.original_values_are} ${endDateLadok} ${messages.and} ${examinationGradeLadok}.`)
    }
    // Round is chosen, but automatic calculation of examination rate is not possible
  } else if (!init) {
    multiLineAlert.push(messages.alert_graduation_rate_cant_be_calculated)
  }
  return multiLineAlert
}

const paramsReducer = (state, action) => ({ ...state, ...action })

function AdminPage() {
  const [webContext] = useWebContext()
  const { analysisData } = webContext

  const [state, setState] = useReducer(paramsReducer, {
    saved: analysisData !== undefined && analysisData.changedDate.length > 2,
    values: analysisData,
    isPublished: analysisData ? analysisData.isPublished : webContext.status === 'published',
    progress: webContext.status === 'new' ? 'new' : 'edit',
    isPreviewMode: webContext.status === 'preview',
    activeSemester: '',
    changedStatus: false,
    modalOpen: {
      publish: false,
      cancel: false,
    },
    alert: '',
    alertSuccess: '',
    madatoryMessage: '',
    analysisFile: analysisData ? analysisData.analysisFileName : '',
    hasNewUploadedFileAnalysis: false,
    notValid: { mandatoryFields: [], overMaxFields: [], wrongFileTypeFields: [] },
    fileProgress: {
      analysis: 0,
    },
    statisticsParams: {
      endDate: analysisData && analysisData.endDate ? analysisData.endDate : '',
      ladokId: analysisData && analysisData.ladokUIDs ? analysisData.ladokUIDs : [],
    },
    endDateInputEnabled: true,
    examinationGradeInputEnabled: true,
    ladokLoading: false,
    multiLineAlert: handleMultiLineAlert({
      init: !analysisData,
      messages: i18n.messages[webContext.language].messages,
      ladokId: analysisData && analysisData.ladokUIDs ? analysisData.ladokUIDs : [],
      endDate: analysisData && analysisData.endDate ? analysisData.endDate : '',
      examinationGrade: analysisData && analysisData.examinationGrade ? analysisData.examinationGrade : -1,
      endDateLadok: analysisData && analysisData.endDateLadok ? analysisData.endDateLadok : '',
      examinationGradeLadok:
        analysisData && analysisData.examinationGradeLadok >= 0 ? analysisData.examinationGradeLadok : -1,
      alterationText: analysisData && analysisData.alterationText ? analysisData.alterationText : '',
    }),
  })

  const { progress, alertSuccess, fileProgress } = state

  useEffect(() => {
    let isMounted = true
    if (isMounted && alertSuccess.length > 0) {
      setTimeout(() => {
        setState({ alertSuccess: '' })
      }, 5000)
    }
    return () => (isMounted = false)
  }, [alertSuccess])

  // *********************************  FILE UPLOAD  ********************************* */
  // ********************************************************************************** */

  async function handleUploadFile(id, file, e) {
    if (e.target.files[0].type === 'application/pdf') {
      const response = await sendRequest(id, file, e)
    } else {
      setState({ notValid: { wrongFileTypeFields: ['analysisFile'] } })
    }
  }

  function sendRequest(id, file, e) {
    const { values } = state
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()
      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          fileProgress[id] = (event.loaded / event.total) * 100
          setState({ fileProgress })
        }
      })

      req.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          values.pdfAnalysisDate = getTodayDate()
          fileProgress.analysis = 0
          const { mandatoryFields, wrongFileTypeFields } = state.notValid
          const mandatoryFieldsIndex = mandatoryFields.indexOf('analysisFile')
          if (mandatoryFieldsIndex > -1) {
            mandatoryFields.splice(mandatoryFieldsIndex, 1)
          }
          const wrongFileTypeFieldsIndex = wrongFileTypeFields.indexOf('analysisFile')
          if (wrongFileTypeFieldsIndex > -1) {
            wrongFileTypeFields.splice(wrongFileTypeFieldsIndex, 1)
          }
          setState({
            analysisFile: this.responseText,
            alertSuccess: i18n.messages[webContext.language].messages.alert_uploaded_file,
            values,
            hasNewUploadedFileAnalysis: true,
            notValid: { mandatoryFields, wrongFileTypeFields },
          })
        }
      }

      let formData = new FormData()
      const data = getMetadata(state.isPublished ? 'published' : state.saved ? 'draft' : 'new')
      formData.append('file', e.target.files[0], e.target.files[0].name)
      formData.append('courseCode', data.courseCode)
      formData.append('analysis', data.analysis)
      formData.append('status', data.status)
      req.open(
        'POST',
        `${webContext.browserConfig.hostUrl}${webContext.paths.storage.saveFile.uri.split(':')[0]}${
          analysisData._id
        }/${id}/${state.isPublished}`
      )
      req.send(formData)
    })
  }

  function getMetadata(status) {
    return {
      courseCode: state.values.courseCode,
      analysis: state.values._id,
      status,
    }
  }

  function handleRemoveFile(event) {
    if (event.target.id === 'remove_analysis') setState({ analysisFile: '', hasNewUploadedFileAnalysis: true })
  }

  // ***************************** BUTTON CLICK HANDLERS ****************************** */
  // ********************************************************************************** */

  function handlePreview(event) {
    event.preventDefault()
    const invalidData = { ...state.notValid, ...validateData(state) }

    if (
      invalidData.mandatoryFields.length > 0 ||
      invalidData.overMaxFields?.length > 0 ||
      invalidData.wrongFileTypeFields.length > 0
    ) {
      setState({
        notValid: invalidData,
        // alertError: i18n.messages[webContext.language].messages.alert_empty_fields,
      })
    } else {
      setState({
        isPreviewMode: true,
        progress: 'preview',
      })
      window.scrollTo(0, 300)
    }
  }

  function handleBack(event) {
    event.preventDefault()
    if (progress === 'edit') {
      if (webContext.semesters.length === 0) {
        return webContext
          .getCourseInformation(webContext.courseCode, webContext.user, webContext.language)
          .then(courseData => {
            setState({
              isPreviewMode: false,
              progress: 'back_new',
              activeSemester: analysisData.semester,
              analysisFile: '',
              alert: '',
              multiLineAlert: [],
            })
          })
      }
      setState({
        isPreviewMode: false,
        progress: 'back_new',
        activeSemester: analysisData.semester,
        alert: '',
        multiLineAlert: [],
        endDateInputEnabled: true,
        examinationGradeInputEnabled: true,
        endDateLadok: '',
        examinationGradeLadok: '-1',
      })
    }
    if (state.isPreviewMode) {
      setState({
        isPreviewMode: false,
        progress: 'edit',
        alert: '',
        multiLineAlert: [],
      })
    }
  }

  function handleCancel(event) {
    window.location = `${SERVICE_URL.admin}${analysisData.courseCode}?serv=kutv&event=cancel`
  }

  function handleSave(event) {
    event.preventDefault()
    const postObject = { ...state.values }

    if (state.analysisFile !== postObject.analysisFileName) {
      postObject.analysisFileName = state.analysisFile
    }

    if (!state.saved && state.analysisFile.length > 0) {
      webContext.updateFileInStorage(state.analysisFile, getMetadata('draft'))
    }

    if (state.statisticsParams && state.statisticsParams.ladokId) {
      postObject.ladokUIDs = state.statisticsParams.ladokId ? state.statisticsParams.ladokId : []
    }

    postObject.courseName = webContext.courseTitle.name

    return webContext.postRoundAnalysisData(postObject, postObject.changedDate.length === 0).then(data => {
      const { roundNamesWithMissingMemos } = webContext
      if (state.isPreviewMode) {
        window.location = encodeURI(
          `${webContext.browserConfig.hostUrl}${SERVICE_URL.admin}${analysisData.courseCode}?serv=kutv&event=save&id=${
            webContext.analysisId
          }&term=${analysisData.semester}&name=${analysisData.analysisName}${
            roundNamesWithMissingMemos ? '&noMemo=' + roundNamesWithMissingMemos : ''
          }`
        ) // term=, name=
      } else {
        setState({
          saved: true,
          progress: 'edit',
          alertSuccess: i18n.messages[webContext.language].messages.alert_saved_draft,
          hasNewUploadedFileAnalysis: false,
          values: data,
        })
      }
    })
  }

  function handlePublish(event, fromModal = false) {
    if (!fromModal) {
      event.preventDefault()
    }

    const { values: postObject } = state
    const { modalOpen: modal } = state

    if (postObject.isPublished) {
      postObject.changedAfterPublishedDate = new Date().toISOString()
    } else {
      if (state.statisticsParams && state.statisticsParams.ladokId) {
        postObject.ladokUIDs = state.statisticsParams.ladokId ? state.statisticsParams.ladokId : []
      }
      postObject.publishedDate = new Date().toISOString()
      postObject.isPublished = true
    }

    postObject.courseName = webContext.courseTitle.name
    postObject.analysisFileName = state.analysisFile

    return webContext.postRoundAnalysisData(postObject, webContext.status === 'new').then(response => {
      modal.publish = false
      if (response === undefined || response.message) {
        setState({
          alert: response.message ? response.message : 'No connection with data base',
          modalOpen: modal,
        })
      } else {
        setState({
          saved: true,
          isPublished: true,
          modalOpen: modal,
          values: response,
        })
        const { roundNamesWithMissingMemos } = webContext

        window.location = encodeURI(
          `${webContext.browserConfig.hostUrl}${SERVICE_URL.admin}${analysisData.courseCode}?serv=kutv&event=pub&id=${
            webContext.analysisId
          }&term=${analysisData.semester}&name=${analysisData.analysisName}${
            roundNamesWithMissingMemos ? '&noMemo=' + roundNamesWithMissingMemos : ''
          }`
        )
      }
    })
  }

  function handleNewExaminationGrade(newEndDate) {
    setState({ ladokLoading: true })
    const { values, statisticsParams } = state
    if (newEndDate.length > 0) {
      return webContext
        .postLadokRoundIdListAndDateToGetStatistics(statisticsParams.ladokId, newEndDate)
        .then(ladokResponse => {
          values.examinationGrade = Math.round(Number(webContext.statistics.examinationGrade) * 10) / 10
          values.examinationGradeFromLadok =
            values['endDate'] === values['endDateLadok'] &&
            Number(values['examinationGrade']) === values['examinationGradeLadok']
          const multiLineAlert = handleMultiLineAlert({
            messages: i18n.messages[webContext.language].messages,
            ladokId: statisticsParams.ladokId,
            endDate: values.endDate,
            examinationGrade: values.examinationGrade,
            endDateLadok: values.endDateLadok,
            examinationGradeLadok: values.examinationGradeLadok,
          })
          setState(state => {
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
      setState({
        values,
        ladokLoading: false,
      })
    }
  }

  function handleTemporaryData(analysisValues, tempData) {
    let returnObject = {
      values: analysisValues,
      files: {
        analysisFile: '',
      },
    }
    if (tempData) {
      returnObject.values.alterationText = tempData.alterationText
      returnObject.values.registeredStudents = tempData.registeredStudents
      returnObject.values.examinationGrade = tempData.examinationGrade
      returnObject.files.analysisFile = tempData.analysisFile
    } else if (analysisValues) {
      returnObject.files.analysisFile = analysisValues.analysisFileName
    }
    return returnObject
  }

  //* *********************** OTHER **************************** */
  //* ************************************************************/

  function editMode(semester, rounds, analysisId, status, tempData, statisticsParams) {
    if (status === 'new') {
      return webContext
        .postLadokRoundIdListAndDateToGetStatistics(statisticsParams.ladokId, statisticsParams.endDate)
        .then(ladokResponse => {
          webContext.createAnalysisData(semester, rounds).then(createdAnalysis => {
            const valuesObject = handleTemporaryData(createdAnalysis, tempData)
            const multiLineAlert = handleMultiLineAlert({
              messages: i18n.messages[webContext.language].messages,
              ladokId: statisticsParams.ladokId,
              endDate: valuesObject.values.endDate,
              examinationGrade: valuesObject.values.examinationGrade,
              endDateLadok: valuesObject.values.endDateLadok,
              examinationGradeLadok: valuesObject.values.examinationGradeLadok,
            })

            setState({
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
    }

    return webContext.getRoundAnalysis(analysisId).then(fetchedAnalysis => {
      const valuesObject = handleTemporaryData(fetchedAnalysis, tempData)

      const _statisticsParams = {}
      _statisticsParams.endDate = valuesObject.values.endDate
      _statisticsParams.ladokId = valuesObject.values.ladokUIDs ? valuesObject.values.ladokUIDs : []
      const multiLineAlert = handleMultiLineAlert({
        messages: i18n.messages[webContext.language].messages,
        ladokId: valuesObject.values.ladokUIDs,
        endDate: valuesObject.values.endDate,
        examinationGrade: valuesObject.values.examinationGrade,
        endDateLadok: valuesObject.values.endDateLadok,
        examinationGradeLadok: valuesObject.values.examinationGradeLadok,
      })
      const endDateInputEnabled = !valuesObject.values.ladokUIDs || !!valuesObject.values.endDate
      setState({
        progress: 'edit',
        isPreviewMode: false,
        isPublished: fetchedAnalysis.isPublished,
        values: valuesObject.values,
        analysisFile: valuesObject.files.analysisFile,
        saved: true,
        statisticsParams: _statisticsParams,
        alert: '',
        multiLineAlert,
        endDateInputEnabled,
      })
    })
  }

  function toggleModal(event) {
    const { modalOpen } = state
    modalOpen[event.target.id] = !modalOpen[event.target.id]
    setState({
      modalOpen,
    })
  }

  function handleInputChange(event) {
    const { values } = state
    let { endDateInputEnabled, examinationGradeInputEnabled } = state

    values[event.target.id] = event.target.value
    if (
      event.target.id === 'examinationGrade' ||
      event.target.id === 'registeredStudents' ||
      event.target.id === 'endDate'
    ) {
      if (state.values[event.target.id + 'FromLadok']) {
        values[event.target.id + 'FromLadok'] = Number(values[event.target.id]) === values[event.target.id + 'Ladok']
      }
    }

    if (event.target.id === 'examinationGrade' && state.statisticsParams.ladokId.length > 0) {
      if (Number(values['examinationGrade']) === values['examinationGradeLadok']) {
        values['endDate'] = values['endDateLadok']
        endDateInputEnabled = true
      } else {
        values['endDate'] = ''
        endDateInputEnabled = false
      }
    } else if (event.target.id === 'endDate' && state.statisticsParams.ladokId.length > 0) {
      handleNewExaminationGrade(values['endDate'])
      examinationGradeInputEnabled = false
    }

    const multiLineAlert = handleMultiLineAlert({
      messages: i18n.messages[webContext.language].messages,
      ladokId: state.statisticsParams.ladokId,
      endDate: values.endDate,
      examinationGrade: values.examinationGrade,
      endDateLadok: values.endDateLadok,
      examinationGradeLadok: values.examinationGradeLadok,
    })

    const invalidFields = []
    if (event.target.id === 'alterationText') {
      const alterationTextLength = values.alterationText ? values.alterationText.length : 0
      if (alterationTextLength > ALTERATION_TEXT_MAX) {
        invalidFields.overMaxFields = ['alterationText']
      } else {
        invalidFields.overMaxFields = []
      }
    }

    const invalidData = { ...state.notValid, ...invalidFields }

    setState({
      endDateInputEnabled,
      examinationGradeInputEnabled,
      values,
      notValid: invalidData,
      multiLineAlert,
    })
  }

  function getTempData() {
    if (progress === 'back_new') {
      const { alterationText, examinationGrade, registeredStudents, roundIdList } = state.values
      const { analysisFile, statisticsParams } = state
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

  const { isPublished } = state
  const translate = i18n.messages[webContext.language].messages

  if (analysisData === undefined || progress === 'back_new') {
    return (
      <div>
        {webContext.errorMessage.length === 0 ? (
          <div>
            <Title
              title={webContext.courseTitle}
              language={webContext.language}
              courseCode={webContext.courseCode}
              header={translate.header_main[webContext.status]}
            />
            <ProgressBar active={1} pages={translate.pagesProgressBar} />

            {/* ************************************************************************************ */}
            {/*                               PAGE1: ANALYSIS MENU                                  */}
            {/* ************************************************************************************ */}
            {webContext.semesters.length === 0 ? (
              <Alert color="info" className="alert-margin">
                {' '}
                {translate.alert_no_rounds}{' '}
              </Alert>
            ) : (
              <AnalysisMenu
                editMode={editMode}
                semesterList={webContext.semesters}
                roundList={webContext.roundData}
                progress={progress}
                activeSemester={state.activeSemester}
                firstVisit={analysisData === undefined}
                status={webContext.status}
                tempData={/*state.saved ? {} : */ getTempData()}
                saved={state.values && state.values.changedDate.length > 0}
                analysisId={state.saved && state.values ? state.values._id : ''}
                context={webContext}
              />
            )}
          </div>
        ) : (
          <Alert className="alert-margin" color="info">
            {' '}
            {webContext.errorMessage}
          </Alert>
        )}
      </div>
    )
  }
  return (
    <div key="kursutveckling-form-container" className="container" id="kursutveckling-form-container">
      {/* ************************************************************************************ */}
      {/*                     PAGE 2: EDIT  AND  PAGE 3: PREVIEW                              */}
      {/* ************************************************************************************ */}
      {webContext.errorMessage.length > 0 ? (
        <Alert color="info" className="alert-margin">
          {webContext.errorMessage}
        </Alert>
      ) : (
        <div>
          <Title
            title={webContext.courseTitle}
            language={webContext.language}
            courseCode={webContext.courseCode}
            header={translate.header_main[webContext.status]}
          />
          {webContext.status !== 'preview' && (
            <ProgressBar active={progress === 'edit' ? 2 : 3} pages={translate.pagesProgressBar} />
          )}

          {/* ************************************************************************************ */}
          {/*                                   PREVIEW                                           */}
          {/* ************************************************************************************ */}
          {state.values && state.isPreviewMode && <Preview values={state.values} analysisFile={state.analysisFile} />}
          <Row key="form" id="form-container">
            <Col sm="12" lg="12">
              {/* ************************************************************************************ */}
              {/*                                 EDIT FORM                                           */}
              {/* ************************************************************************************ */}

              {state.values && !state.isPreviewMode ? (
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
                    {`${translate.course_short_semester[state.values.semester.toString().match(/.{1,4}/g)[1]]} 
                  ${state.values.semester.toString().match(/.{1,4}/g)[0]}`}
                    <b> {translate.header_course_offering}</b> {state.values.analysisName}
                  </p>

                  <p>{translate.header_mandatory_fields}</p>

                  {/* ----- ALERTS ----- */}
                  {state.alert.length > 0 && (
                    <Row>
                      <Alert color="info" className="alert-margin">
                        {state.alert}{' '}
                      </Alert>
                    </Row>
                  )}
                  {state.multiLineAlert.length > 0 && (
                    <Row>
                      <Alert color="info" className="alert-margin">
                        {state.multiLineAlert.map((text, index) => (
                          <p key={'alert-p-' + index}>{text}</p>
                        ))}
                      </Alert>
                    </Row>
                  )}
                  {state.alertSuccess.length > 0 && (
                    <Row>
                      <Alert color="success">{state.alertSuccess} </Alert>
                    </Row>
                  )}
                  <AlertError notValid={state.notValid} translations={i18n.messages[webContext.language]} />
                  {/* FORM - FIRST COLUMN */}
                  <Row className="form-group">
                    <Col sm="4" className="col-form">
                      <h4>{translate.header_upload}</h4>

                      {/** ------ ANALYSIS-FILE UPLOAD ------- **/}
                      <FormLabel translate={translate} header="header_upload_file" id="info_upload_course_analysis" />
                      <UpLoad
                        id="analysis"
                        key="analysis"
                        handleUpload={handleUploadFile}
                        progress={fileProgress.analysis}
                        path={webContext.browserConfig.proxyPrefixPath.uri}
                        file={state.analysisFile}
                        notValid={state.notValid}
                        handleRemoveFile={handleRemoveFile}
                        type="analysisFile"
                      />
                      {state.analysisFile.length > 0 && (
                        <span>
                          <FormLabel
                            translate={translate}
                            header="header_upload_file_date"
                            id="info_upload_course_analysis_date"
                          />
                          <Input
                            id="pdfAnalysisDate"
                            key="pdfAnalysisDate"
                            type="date"
                            value={state.values.pdfAnalysisDate}
                            onChange={handleInputChange}
                            className={state.notValid.mandatoryFields.includes('pdfAnalysisDate') ? 'not-valid ' : ''}
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
                        header="header_course_changes_comment"
                        id="info_course_changes_comment"
                        badgeText={state.values.alterationText.length || '0'}
                        mode={state.values.alterationText.length > ALTERATION_TEXT_MAX ? 'danger' : 'warning'}
                      />
                      <Input
                        style={{ height: 300 }}
                        id="alterationText"
                        key="alterationText"
                        type="textarea"
                        value={state.values.alterationText}
                        onChange={handleInputChange}
                        className={state.notValid.overMaxFields?.includes('alterationText') ? 'not-valid' : ''}
                      />
                    </Col>

                    {/* ------ FORM - THIRD COLUMN -------- */}
                    <Col sm="4" className="col-form">
                      <h4>{translate.header_check_data}</h4>

                      <FormLabel translate={translate} header="header_examiners" id="info_examiners" />
                      <Input
                        id="examiners"
                        key="examiners"
                        type="text"
                        value={state.values.examiners}
                        onChange={handleInputChange}
                        className={state.notValid.mandatoryFields.includes('examiners') ? 'not-valid' : ''}
                      />

                      <FormLabel translate={translate} header="header_responsibles" id="info_responsibles" />
                      <Input
                        id="responsibles"
                        key="responsibles"
                        type="text"
                        value={state.values.responsibles}
                        onChange={handleInputChange}
                        className={state.notValid.mandatoryFields.includes('responsibles') ? 'not-valid' : ''}
                      />

                      <FormLabel translate={translate} header="header_registrated" id="info_registrated" />
                      <Input
                        id="registeredStudents"
                        key="registeredStudents"
                        type="number"
                        placeholder="0"
                        value={state.values.registeredStudents}
                        onChange={handleInputChange}
                        className={state.notValid.mandatoryFields.includes('registeredStudents') ? 'not-valid' : ''}
                      />

                      <FormLabel translate={translate} header="header_examination_grade" id="info_examination_grade" />
                      <div className="calculate-examination-grade">
                        <div>
                          <h5>{translate.header_end_date}</h5>
                          <Input
                            id="endDate"
                            key="endDate"
                            type="date"
                            value={state.values.endDate}
                            onChange={handleInputChange}
                            className={state.notValid.mandatoryFields.includes('endDate') ? 'not-valid' : ''}
                            disabled={state.endDateInputEnabled ? '' : 'disabled'}
                            max="2099-12-31"
                          />
                        </div>
                        <div>
                          <h5>{translate.header_result}</h5>
                          <span>
                            {state.ladokLoading === true ? (
                              <span className="ladok-loading-progress-inline">
                                <Spinner size="sm" color="primary" />
                              </span>
                            ) : (
                              ''
                            )}
                            <Input
                              id="examinationGrade"
                              key="examinationGrade"
                              type="number"
                              placeholder="0"
                              value={state.values.examinationGrade}
                              onChange={handleInputChange}
                              className={state.notValid.mandatoryFields.includes('examinationGrade') ? 'not-valid' : ''}
                              disabled={state.examinationGradeInputEnabled ? '' : 'disabled'}
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
                            value={state.values.commentChange}
                            onChange={handleInputChange}
                            className={state.notValid.mandatoryFields.indexOf('commentChange') > -1 ? 'not-valid' : ''}
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
              {/* ************************************************************************************ */}
              {/*                                BUTTONS FOR PAG 2 AND 3                              */}
              {/* ************************************************************************************ */}
              {state.isPreviewMode &&
                state.values.changedDate.length > 0 &&
                webContext.status !== 'preview' &&
                webContext.analysisId && <CopyText webContext={webContext} header={translate.header_copy_link} />}

              <Row className="button-container text-center">
                <Col sm="4" className="align-left-sm-center">
                  {webContext.status === 'preview' ? (
                    ''
                  ) : (
                    <Button className="back" color="secondary" id="back" key="back" onClick={handleBack}>
                      {state.isPreviewMode ? translate.btn_back_edit : translate.btn_back}
                    </Button>
                  )}
                </Col>
                <Col sm="3" className="align-right-sm-center">
                  {webContext.status !== 'preview' && (
                    <Button color="secondary" id="cancel" key="cancel" onClick={toggleModal}>
                      {translate.btn_cancel}
                    </Button>
                  )}
                </Col>
                <Col sm="3">
                  {state.isPublished || webContext.status === 'preview' ? (
                    ''
                  ) : (
                    <Button color="secondary" id="save" key="save" onClick={handleSave}>
                      {state.isPreviewMode ? translate.btn_save_and_cancel : translate.btn_save}
                    </Button>
                  )}
                </Col>
                <Col sm="2">
                  {webContext.status !== 'preview' && (
                    <span>
                      {state.isPreviewMode ? (
                        <Button color="success" id="publish" key="publish" onClick={toggleModal}>
                          {translate.btn_publish}
                        </Button>
                      ) : (
                        <Button className="next" color="success" id="preview" key="preview" onClick={handlePreview}>
                          {translate.btn_preview}
                        </Button>
                      )}
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          {/* ************************************************************************************ */}
          {/*                               MODALS FOR PUBLISH AND CANCEL                         */}
          {/* ************************************************************************************ */}
          <InfoModal
            type="publish"
            toggle={toggleModal}
            isOpen={state.modalOpen.publish}
            id={webContext.analysisId}
            handleConfirm={handlePublish}
            infoText={translate.info_publish}
          />
          <InfoModal
            type="cancel"
            toggle={toggleModal}
            isOpen={state.modalOpen.cancel}
            id={webContext.analysisId}
            handleConfirm={handleCancel}
            infoText={translate.info_cancel}
          />
        </div>
      )}
    </div>
  )
}

const FormLabel = ({ translate, header, id, badgeText, mode = 'warning' }) => (
  <span className="inline-flex">
    <Label>
      {translate[header]} {badgeText ? <span className={`badge badge-${mode} badge-pill`}>{badgeText}</span> : null}
    </Label>
    <InfoButton id={id} textObj={translate[id]} />
  </span>
)

const AlertError = ({ notValid, translations }) => {
  const { mandatoryFields, overMaxFields, wrongFileTypeFields } = notValid
  const noOfErrorCategories =
    (mandatoryFields.length ? 1 : 0) + (overMaxFields?.length ? 1 : 0) + (wrongFileTypeFields.length ? 1 : 0)
  if (!noOfErrorCategories) {
    return null
  }

  const errors =
    noOfErrorCategories === 1 ? (
      <>
        {!!mandatoryFields.length && <>{translations.messages.alert_empty_fields}</>}
        {!!overMaxFields?.length && (
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
        {!!overMaxFields?.length && (
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
