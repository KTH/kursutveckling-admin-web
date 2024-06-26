/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
import React, { useReducer } from 'react'

import { Form, FormGroup, Label, Input, Collapse } from 'reactstrap'

import i18n from '../../../../i18n/index'
import Alert from '../components-shared/Alert'
import Button from '../components-shared/Button'
import { SERVICE_URL } from '../util/constants'
import { getDateFormat, getValueFromObjectList } from '../util/helpers'
import { goToStartPage } from '../util/links'

import InfoModal from './InfoModal'
import InfoButton from './InfoButton'

const paramsReducer = (state, action) => ({ ...state, ...action })

function AnalysisMenu(props) {
  const {
    context: rawContext,
    activeSemester,
    firstVisit: extFirstVisit,
    progress,
    saved,
    semesterList,
    tempData,
    status,
    roundList,
  } = props
  const context = React.useMemo(() => rawContext, [rawContext])
  const [state, setState] = useReducer(paramsReducer, {
    alert: '',
    firstVisit: extFirstVisit,
    showEditBtn: false,
    collapseOpen: progress === 'back_new',
    modalOpen: {
      delete: false,
      info: false,
      copy: false,
    },
    semester: activeSemester && activeSemester.length > 0 ? activeSemester : semesterList[0],
    rounds: tempData && !saved ? tempData.applicationCodes.split(',') : [],
    usedRounds: context.usedRounds.usedRounds || [],
    draftAnalysis: context.usedRounds.draftAnalysis || [],
    publishedAnalysis: context.usedRounds.publishedAnalysis || [],
    selectedRadio: {
      draft: '',
      published: '',
    },
    lastSelected: tempData ? 'new' : '',
    canOnlyPreview: '',
    temporaryData: tempData,
    newSemester: false,
    statisticsParams: {
      endDate: tempData ? tempData.statisticsParams.endDate : '',
      ladokId: tempData ? tempData.statisticsParams.ladokId : [],
    },
    ladokLoading: false,
  })

  const translate = i18n.messages[context.language].messages
  const showAllEmptyNew =
    status !== 'published' &&
    state.draftAnalysis.length === 0 &&
    roundList[state.semester].length === state.usedRounds.length
  const showAllEmptyPublished = status === 'published' && state.publishedAnalysis.length === 0
  const {
    alert,
    firstVisit,
    collapseOpen,
    modalOpen,
    semester,
    rounds,
    usedRounds,
    draftAnalysis,
    publishedAnalysis,
    selectedRadio,
    canOnlyPreview,
    statisticsParams,
  } = state
  //* * ********************** CHECKBOXES AND RADIO BUTTONS **************************** */
  //* ********************************************************************************* */

  function handleRoundCheckbox(event) {
    event.persist()
    const endDate = event.target.getAttribute('data-enddate')
    const ladokId = event.target.getAttribute('data-uid')
    const prevState = { ...state }
    prevState.canOnlyPreview = false

    if (state.alert.length > 0) prevState.alert = ''

    if (event.target.checked) {
      if (prevState.statisticsParams.endDate.length > 0 && prevState.statisticsParams.endDate !== endDate) {
        setState({ alert: i18n.messages[context.language].messages.alert_different_end_dates })
      } else {
        prevState.selectedRadio.draft = []
        prevState.rounds.push(event.target.id)
        prevState.lastSelected = 'new'
        prevState.temporaryData = undefined
        prevState.statisticsParams.endDate = endDate
        if (prevState.statisticsParams.ladokId.indexOf(ladokId) === -1 && ladokId.length > 0)
          prevState.statisticsParams.ladokId.push(ladokId)
        setState(prevState)
      }
    } else {
      prevState.rounds.splice(state.rounds.indexOf(event.target.id), 1)
      prevState.statisticsParams.ladokId.splice(prevState.statisticsParams.ladokId.indexOf(ladokId), 1)
      if (prevState.rounds.length === 0) {
        prevState.statisticsParams.endDate = ''
      }
      prevState.temporaryData = undefined
      setState(prevState)
    }
  }

  function handleSelectedDraft(event) {
    const prevState = { ...state }

    prevState.rounds = []
    prevState.statisticsParams.endDate = ''
    prevState.statisticsParams.ladokId = []
    if (event.target.id.indexOf('_preview') > 0) {
      prevState.selectedRadio.draft = event.target.id.split('_preview')[0]
      prevState.canOnlyPreview = true
      setState(prevState)
    } else {
      prevState.selectedRadio.draft = event.target.id
      prevState.lastSelected = 'draft'
      prevState.alert = ''
      prevState.canOnlyPreview = false
      prevState.temporaryData = undefined
      setState(prevState)
    }
  }

  function handleSelectedPublished(event) {
    const prevState = { ...state }

    if (event.target.id.indexOf('_preview') > 0) {
      prevState.selectedRadio.published = event.target.id.split('_preview')[0]
      prevState.canOnlyPreview = true
      setState(prevState)
    } else {
      prevState.selectedRadio.published = event.target.id
      prevState.lastSelected = 'published'
      prevState.alert = ''
      prevState.temporaryData = undefined
      setState(prevState)
    }
  }

  //* *********************** SUBMIT BUTTONS **************************** */
  //* ******************************************************************* */

  function goToEditMode(event) {
    event.preventDefault()
    const { lastSelected, temporaryData } = state

    if (rounds.length > 0 || selectedRadio.published.length > 0 || selectedRadio.draft.length > 0) {
      setState({ ladokLoading: true })
      if (lastSelected === 'new') {
        props.editMode(semester, rounds, null, lastSelected, temporaryData, statisticsParams)
      } else {
        props.editMode(semester, null, selectedRadio[lastSelected], lastSelected, temporaryData, statisticsParams)
      }
    } else {
      setState({
        alert: i18n.messages[context.language].messages.alert_no_rounds_selected,
      })
    }
  }

  function handleCancel(event) {
    event.preventDefault()
    goToStartPage(`${SERVICE_URL.admin}${context.courseCode}?serv=kutv&event=cancel`)
  }

  //* ******************************************************************* */
  //* ***************************** OTHER ******************************* */

  function getUsedRounds(sem) {
    const { analysisId } = props
    const prevState = state
    return context.getUsedRounds(context.courseData.courseCode, sem).then(() => {
      if (analysisId && analysisId.length > 0) {
        if (context.status === 'draft') {
          prevState.selectedRadio.draft = analysisId
          prevState.lastSelected = 'draft'
        } else {
          prevState.selectedRadio.published = analysisId
          prevState.lastSelected = 'published'
        }
      }
      setState({
        semester: sem,
        usedRounds: context.usedRounds.usedRounds,
        draftAnalysis: context.usedRounds.draftAnalysis,
        publishedAnalysis: context.usedRounds.publishedAnalysis,
        selectedRadio: prevState.selectedRadio,
        lastSelected: prevState.lastSelected,
        alert: '',
      })
    })
  }

  async function handleDelete(id, fromModal = false) {
    if (!fromModal) {
      if (state.selectedRadio.draft.length > 0) {
        modalOpen.delete = !modalOpen.delete === true
        setState({
          modalOpen,
        })
      } else {
        setState({
          alert: i18n.messages[context.language].messages.alert_no_rounds_selected,
        })
      }
    } else {
      try {
        const resultAfterDeleteObj = await context.deleteRoundAnalysis(id)
        if (resultAfterDeleteObj.status >= 400) {
          return 'handleDelete-Obj-ERROR-' + resultAfterDeleteObj.status
        }

        const analysisName = getValueFromObjectList(state.draftAnalysis, id, 'analysisId', 'analysisName')
        goToStartPage(
          `${SERVICE_URL.admin}${context.courseCode}?serv=kutv&event=delete&id=${state.selectedRadio.draft}&term=${state.semester}&name=${analysisName}`
        )
        getUsedRounds(state.semester)

        selectedRadio.draft = ''
        modalOpen.delete = !modalOpen.delete === true
        setState({
          modalOpen,
          selectedRadio,
        })

        return resultAfterDeleteObj
      } catch (error) {
        if (error.response) {
          throw new Error(error.message)
        }
        throw error
      }
    }
  }

  function handlePreview(event) {
    event.preventDefault()
    const analysisId = state.selectedRadio.draft.length > 0 ? state.selectedRadio.draft : state.selectedRadio.published
    window.open(
      `${context.browserConfig.hostUrl}${
        context.browserConfig.proxyPrefixPath.uri
      }/preview/${analysisId}?title=${encodeURI(
        `${context.courseTitle.name}_${context.courseTitle.credits}`
      )}&back=true`
    )
  }

  function toggleModal(ev, id) {
    const modalid = id || ev.target.id
    const { modalOpen } = state
    modalOpen[modalid] = !modalOpen[modalid]
    setState({
      modalOpen,
    })
  }

  function handleSelectedSemester(event) {
    event.preventDefault()
    const { selectedRadio: radios } = state
    radios.published = ''
    radios.draft = ''
    state.statisticsParams.endDate = ''
    state.statisticsParams.ladokId = []
    getUsedRounds(event.target.value)
    setState({
      semester: event.target.value,
      collapseOpen: true,
      firstVisit: false,
      rounds: [],
      lastSelected: '',
      selectedRadio: radios,
      newSemester: true,
    })
  }

  function showEditButton() {
    return context.status === 'published'
      ? state.publishedAnalysis.length > 0
      : state.draftAnalysis.length > 0 || roundList[state.semester].length > state.usedRounds.length
  }

  return (
    <div id="YearAndRounds">
      <p>{translate.intro_analysis_menu}</p>

      {/* ************************************************************************************ */}
      {/*                               SEMESTER DROPDOWN                          */}
      {/* ************************************************************************************ */}

      <div>
        <h3>
          {translate.select_semester}
          <InfoButton id="info_select_semester" textObj={translate.info_select_semester} />
        </h3>
        <form>
          <div className="form-group">
            <div className="select-wrapper">
              <select
                className="form-select"
                id="semesterDropdownControl"
                aria-label={translate.select_semester}
                onChange={handleSelectedSemester}
                defaultValue={semester && semester > 0 && !firstVisit ? semester : translate.select_semester}
              >
                <option value={translate.select_semester} key="no-chosen">
                  {translate.select_semester}
                </option>

                {semesterList &&
                  semesterList.map(sem => (
                    <option id={sem} key={sem} value={sem}>
                      {`
                    ${translate.course_short_semester[sem.toString().match(/.{1,4}/g)[1]]} 
                    ${sem.toString().match(/.{1,4}/g)[0]}
                  `}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </form>
      </div>
      {alert.length > 0 && <Alert type="warning">{alert}</Alert>}

      {/** *********************************************************************************** */}
      {/*                        SELECT BUTTONS FOR ANALYSIS OR ROUNDS                        */}
      {/** *********************************************************************************** */}
      <Collapse isOpen={collapseOpen}>
        <div id="analysisMenuContainer">
          {showAllEmptyNew || showAllEmptyPublished ? (
            <Alert type="info">
              <p>{showAllEmptyNew ? translate.alert_no_rounds : translate.alert_no_published}</p>
            </Alert>
          ) : (
            <Form>
              <h3>
                {translate.header_analysis_menu}
                <InfoButton id="info_choose_course_offering" textObj={translate.info_choose_course_offering} />
              </h3>

              {status === 'new' || status === 'draft' ? (
                <div className="selectBlock">
                  {/** *********************************************************************************** */}
                  {/*                              DRAFT ANALYSIS                                          */}
                  {/** *********************************************************************************** */}
                  {draftAnalysis.length > 0 && (
                    <>
                      <p>{translate.intro_draft}</p>
                      {draftAnalysis.map(analysis => (
                        <FormGroup className="form-check" id="drafts" key={analysis.analysisId}>
                          <Input
                            type="radio"
                            id={`${
                              !analysis.canBeAccessedByUser ? analysis.analysisId + '_preview' : analysis.analysisId
                            }`}
                            key={analysis.analysisId}
                            value={analysis.analysisId}
                            onChange={handleSelectedDraft}
                            checked={selectedRadio.draft === analysis.analysisId}
                          />
                          <Label key={'Label' + analysis.analysisId} for={analysis.analysisId}>
                            {analysis.analysisName}{' '}
                            <span className="no-access">
                              {' '}
                              {analysis.canBeAccessedByUser ? '' : translate.not_authorized_course_offering}
                            </span>
                          </Label>
                        </FormGroup>
                      ))}
                    </>
                  )}

                  {/** *********************************************************************************** */}
                  {/*                               NEW ANALYSIS                                          */}
                  {/** *********************************************************************************** */}
                  {roundList[semester].length > usedRounds.length && (
                    <>
                      <p>{translate.intro_new}</p>
                      {roundList[semester].map(
                        round =>
                          usedRounds.indexOf(round.applicationCode) < 0 &&
                          (round.state === 'APPROVED' || round.state === 'FULL') && (
                            <FormGroup className="form-check" id="rounds" key={round.applicationCode}>
                              <Input
                                type="checkbox"
                                id={round.applicationCode}
                                key={'checkbox' + round.applicationCode}
                                onChange={handleRoundCheckbox}
                                checked={rounds.indexOf(round.applicationCode) > -1}
                                name={round.applicationCode}
                                disabled={!round.canBeAccessedByUser}
                                data-uid={round.ladokUID}
                                data-enddate={round.endDate}
                              />
                              <Label key={'Label' + round.applicationCode} for={round.applicationCode}>
                                {round.shortName
                                  ? round.shortName + ' '
                                  : `${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} ${
                                      semester.toString().match(/.{1,4}/g)[0]
                                    }-${round.applicationCode}`}
                                ( {translate.label_start_date} {getDateFormat(round.startDate, round.language)},{' '}
                                {round.language} )
                                <span className="no-access">
                                  {' '}
                                  {round.canBeAccessedByUser ? '' : translate.not_authorized_publish_new}
                                </span>
                              </Label>
                            </FormGroup>
                          )
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="selectBlock">
                  {/** *********************************************************************************** */}
                  {/*                               PUBLISHED ANALYSIS                                    */}
                  {/** *********************************************************************************** */}
                  {publishedAnalysis.length > 0 ? (
                    <div>
                      <p>{translate.intro_published}</p>
                      {publishedAnalysis.map(analysis => (
                        <FormGroup className="form-check" key={analysis.analysisId}>
                          <Input
                            type="radio"
                            id={`${
                              !analysis.canBeAccessedByUser ? analysis.analysisId + '_preview' : analysis.analysisId
                            }`}
                            key={analysis.analysisId}
                            value={analysis.analysisId}
                            onChange={handleSelectedPublished}
                            checked={selectedRadio.published === analysis.analysisId}
                          />
                          <Label key={'Label' + analysis.analysisId} for={analysis.analysisId}>
                            {analysis.analysisName}{' '}
                            <span className="no-access">
                              {' '}
                              {analysis.canBeAccessedByUser ? '' : translate.not_authorized_course_offering}
                            </span>
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  ) : (
                    <p>{translate.published_empty}</p>
                  )}
                </div>
              )}
            </Form>
          )}
        </div>
      </Collapse>
      {/** *********************************************************************************** */}
      {/*                             BUTTONS FOR ANALYSIS MENU                               */}
      {/** *********************************************************************************** */}
      <div className="control-buttons">
        <div>
          {selectedRadio.draft.length > 0 && !canOnlyPreview ? (
            <span>
              <Button variant="error" id="delete" key="delete" onClick={toggleModal} style={{ marginRight: '5px' }}>
                {translate.btn_delete}
              </Button>
              <Button variant="secondary" id="copy" key="copy" onClick={toggleModal}>
                {translate.btn_copy}
              </Button>
            </span>
          ) : (
            ''
          )}
        </div>
        <div>
          <Button variant="secondary" id="cancel" key="cancel" onClick={handleCancel}>
            {translate.btn_cancel}
          </Button>
        </div>
        <div>
          {!firstVisit && showEditButton() && !canOnlyPreview && (
            <Button className="next" variant="success" id="new" key="new" onClick={goToEditMode} disabled={firstVisit}>
              {translate.btn_add_analysis}
            </Button>
          )}
          {canOnlyPreview && (
            <Button variant="next" id="new" key="new" onClick={handlePreview}>
              {translate.btn_preview}
            </Button>
          )}
        </div>
      </div>
      {/** *********************************************************************************** */}
      {/*                               MODALS FOR DELETE AND COPY                            */}
      {/** *********************************************************************************** */}
      <InfoModal
        type="delete"
        toggle={toggleModal}
        isOpen={modalOpen.delete}
        id={selectedRadio.draft}
        handleConfirm={handleDelete}
        infoText={translate.info_delete}
      />
      <InfoModal
        type="copy"
        toggle={toggleModal}
        isOpen={modalOpen.copy}
        id="copy"
        url={`${context.browserConfig.hostUrl}${context.browserConfig.proxyPrefixPath.uri}/preview/${
          selectedRadio.draft
        }?title=${encodeURI(context.courseTitle.name + '_' + context.courseTitle.credits)}`}
        infoText={translate.info_copy_link}
        copyHeader={translate.header_copy_link}
      />
    </div>
  )
}

export default AnalysisMenu
