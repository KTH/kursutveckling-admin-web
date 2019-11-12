import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Form, Dropdown, FormGroup, Label, 
        Input, Collapse, DropdownToggle, DropdownItem, 
        DropdownMenu, Button, Row, Col, Spinner } from 'reactstrap'

//Custom components
import InfoModal from './InfoModal'
import InfoButton from './InfoButton'

import i18n from '../../../../i18n/index'
import { EMPTY, SERVICE_URL } from '../util/constants'
import { getDateFormat, getValueFromObjectList } from '../util/helpers'
import loader from '../../../img/*.gif'

@inject(['routerStore']) @observer
class AnalysisMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: '',
            firstVisit: this.props.firstVisit,
            showEditBtn: false,
            dropdownOpen: false,
            collapseOpen: this.props.progress === 'back_new',
            modalOpen: {
                delete: false,
                info: false,
                copy: false
            },
            semester: this.props.activeSemester && this.props.activeSemester.length > 0  ? this.props.activeSemester   : this.props.semesterList[0],
            rounds: this.props.tempData && !this.props.saved ? this.props.tempData.roundIdList.split(',') : [],
            usedRounds: this.props.routerStore.usedRounds.usedRounds ? this.props.routerStore.usedRounds.usedRounds  : [],
            draftAnalysis: this.props.routerStore.usedRounds.draftAnalysis ? this.props.routerStore.usedRounds.draftAnalysis : [],
            publishedAnalysis: this.props.routerStore.usedRounds.publishedAnalysis ? this.props.routerStore.usedRounds.publishedAnalysis : [],
            selectedRadio: {
                draft: '',
                published:'',
            },
            lastSelected: this.props.tempData ? 'new' : '',
            canOnlyPreview: '',
            temporaryData: this.props.tempData,
            newSemester: false,
            statisticsParams: {
                endDate: this.props.tempData ? this.props.tempData.statisticsParams.endDate : '',
                ladokId: this.props.tempData ? this.props.tempData.statisticsParams.ladokId : []
            },
            ladokLoading: false
        
        }

        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
        this.goToEditMode = this.goToEditMode.bind(this)
        this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
        this.handleSelectedDraft = this.handleSelectedDraft.bind(this)
        this.handleSelectedPublished = this.handleSelectedPublished.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handlePreview = this.handlePreview.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    
    //******************************* SEMESTER DROPDOWN ******************************* */
    //********************************************************************************** */
    toggleDropdown(event) {
        event.preventDefault()
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        })
    }

    handleSelectedSemester(event) {
        event.preventDefault()
        let radios = this.state.selectedRadio
        radios.published = ''
        radios.draft = ''
        this.state.statisticsParams.endDate = ''
        this.state.statisticsParams.ladokId = []
        this.getUsedRounds(event.target.id)
        this.setState({
            semester: event.target.id,
            collapseOpen: true,
            firstVisit: false,
            rounds:[],
            lastSelected:'',
            selectedRadio: radios,
            newSemester: true
        })
    }

    
    //************************ CHECKBOXES AND RADIO BUTTONS **************************** */
    //********************************************************************************** */
    handleRoundCheckbox(event) {
        event.persist()
        let  endDate = event.target.getAttribute("data-enddate")
        let ladokId = event.target.getAttribute("data-uid")
        let prevState = this.state
        prevState.canOnlyPreview = false

        if ( this.state.alert.length > 0 )
            prevState.alert = ''

        if ( event.target.checked ){
            if(prevState.statisticsParams.endDate.length > 0 && prevState.statisticsParams.endDate !== endDate){
                this.setState({alert: i18n.messages[this.props.routerStore.language].messages.alert_different_end_dates})
            }else{
                prevState.selectedRadio.draft = []
                prevState.rounds.push(event.target.id)
                prevState.lastSelected = 'new'
                prevState.temporaryData = undefined
                prevState.statisticsParams.endDate = endDate
                prevState.statisticsParams.ladokId.indexOf(ladokId) === -1 && ladokId.length > 0 ? prevState.statisticsParams.ladokId.push(ladokId) : ''
                this.setState(prevState)
            }
        }
        else{
            prevState.rounds.splice(this.state.rounds.indexOf(event.target.id), 1)
            prevState.statisticsParams.ladokId.splice( prevState.statisticsParams.ladokId.indexOf(ladokId), 1)
            if(prevState.rounds.length === 0){
                prevState.statisticsParams.endDate = ''
            }
            prevState.temporaryData = undefined
            this.setState(prevState)
        }
    }

    handleSelectedDraft(event) {
        let prevState = this.state
        prevState.rounds =[]
        prevState.statisticsParams.endDate = ''
        prevState.statisticsParams.ladokId = []
        if(event.target.id.indexOf('_preview') >0 ){
            prevState.selectedRadio.draft = event.target.id.split('_preview')[0]
            prevState.canOnlyPreview = true
            this.setState(prevState)
        } else {
            prevState.selectedRadio.draft = event.target.id
            prevState.lastSelected = 'draft'
            prevState.alert = ''
            prevState.canOnlyPreview = false
            prevState.temporaryData = undefined
            this.setState(prevState)
        }
    }

    handleSelectedPublished(event) {
        let prevState = this.state
        if(event.target.id.indexOf('_preview') >0 ){
            prevState.selectedRadio.published = event.target.id.split('_preview')[0]
            prevState.canOnlyPreview = true
            this.setState(prevState)
        }else{
            prevState.selectedRadio.published = event.target.id
            prevState.lastSelected = 'published'
            prevState.alert = ''
            prevState.temporaryData = undefined
            this.setState(prevState)
        }
    }

   
    //************************ SUBMIT BUTTONS **************************** */
    //******************************************************************** */

    goToEditMode(event) {
        event.preventDefault()
        const {rounds, selectedRadio, semester, lastSelected, temporaryData, statisticsParams, ladokLoading} = this.state

        if (rounds.length > 0 || selectedRadio.published.length > 0 || selectedRadio.draft.length > 0 ){
            this.setState({ladokLoading:true})
            if(lastSelected === 'new'){
                this.props.editMode(semester, rounds, null, lastSelected, temporaryData, statisticsParams)
            } else { 
                this.props.editMode(semester, null, selectedRadio[this.state.lastSelected], lastSelected, temporaryData, statisticsParams)
            }
        } else {
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
        }
    }

    handleCancel(event) {
        event.preventDefault()
        window.location=`${SERVICE_URL[this.props.routerStore.service]}${this.props.routerStore.courseCode}?serv=kutv&event=cancel`
      }

    handleDelete ( id, fromModal = false ){
        if( !fromModal ){
            if (this.state.selectedRadio.draft.length > 0){
                let modalOpen = this.state.modalOpen
                modalOpen.delete = ! modalOpen.delete === true
                this.setState({
                    modalOpen: modalOpen
                })
            }
            else{
                this.setState({
                    alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
                })
            }
        }
        else{
            this.props.routerStore.deleteRoundAnalysis(id).then(result =>{
                this.props.routerStore.deleteFileInStorage(id).then( result => {
                const analysisName = getValueFromObjectList(this.state.draftAnalysis, id, 'analysisId', 'analysisName')
                window.location=`${SERVICE_URL[this.props.routerStore.service]}${this.props.routerStore.courseCode}?serv=kutv&event=delete&id=${this.state.selectedRadio.draft}&term=${this.state.semester}&name=${analysisName}`
                this.getUsedRounds(this.state.semester)

                let { modalOpen, selectedRadio} = this.state
                selectedRadio.draft = ''
                modalOpen.delete = ! modalOpen.delete === true
                this.setState({
                    modalOpen,
                    selectedRadio
                })
            })
            })
        }
    }

   handlePreview(event){
       event.preventDefault()
       const {routerStore} = this.props
       const analysisId = this.state.selectedRadio.draft.length > 0 ? this.state.selectedRadio.draft : this.state.selectedRadio.published
       window.open(`${routerStore.browserConfig.hostUrl}${routerStore.browserConfig.proxyPrefixPath.uri}/preview/${analysisId}?title=${encodeURI(routerStore.courseTitle.name+'_'+routerStore.courseTitle.credits)}&back=true`)
   }

    toggleModal(event){
        let modalOpen = this.state.modalOpen
        modalOpen[event.target.id] = !modalOpen[event.target.id]
        this.setState({
          modalOpen: modalOpen
        })
      }
    //******************************************************************** */
    //****************************** OTHER ******************************* */

    getUsedRounds(semester) {
        const thisInstance = this
        const {routerStore , analysisId } = this.props
        const prevState = this.state
        return this.props.routerStore.getUsedRounds(routerStore.courseData.courseCode, semester)
            .then(result => {
                if( analysisId && analysisId.length > 0){
                    if(routerStore.status === 'draft'){
                        prevState.selectedRadio.draft = analysisId
                        prevState.lastSelected = 'draft'
                    } else {
                        prevState.selectedRadio.published = analysisId
                        prevState.lastSelected = 'published'
                    }
                }
                thisInstance.setState({
                    semester: semester,
                    usedRounds: routerStore.usedRounds.usedRounds,
                    draftAnalysis: routerStore.usedRounds.draftAnalysis,
                    publishedAnalysis: routerStore.usedRounds.publishedAnalysis,
                    selectedRadio: prevState.selectedRadio,
                    lastSelected: prevState.lastSelected,
                    alert: ''
                })
            })
    }

    showEditButton(){
        return(
            this.props.routerStore.status === 'published'
                ? this.state.publishedAnalysis.length > 0
                : this.state.draftAnalysis.length > 0 || this.props.roundList[this.state.semester].length > this.state.usedRounds.length
        )
    }
    

    componentWillMount() {
        const {routerStore , analysisId } = this.props
        //const prevSelectedId = analysisId
        const prevState = this.state
       
        if (routerStore.usedRounds.length === 0 || routerStore.hasChangedStatus){
            this.getUsedRounds(this.state.semester)
            prevState.statisticsParams.endDate = ''
            prevState.statisticsParams.ladokId = []
        } else {
            if( analysisId && analysisId.length > 0 && !this.state.newSemester){
                if(routerStore.status === 'draft' && routerStore.analysisData && routerStore.analysisData.isPublished !== true){
                    prevState.selectedRadio.draft = analysisId
                    prevState.lastSelected = 'draft'
                } else {

                    prevState.selectedRadio.published = analysisId
                    prevState.lastSelected = 'published'
                }
            }
            if (this.props.progress === 'new_back'){
                this.setState({
                    semester: this.state.semester,
                    usedRounds: routerStore.usedRounds.usedRounds,
                    draftAnalysis: routerStore.usedRounds.draftAnalysis,
                    publishedAnalysis: routerStore.usedRounds.publishedAnalysis,
                    selectedRadio: prevState.selectedRadio,
                    lastSelected: prevState.lastSelected,
                    alert: ''
                })
            }
        }
    }

    render() {
        const { status, semesterList, roundList, routerStore } = this.props
        const translate = i18n.messages[routerStore.language].messages
        const showAllEmptyNew = status !== 'published' && this.state.draftAnalysis.length === 0 && roundList[this.state.semester].length === this.state.usedRounds.length
        const showAllEmptyPublished = status === 'published' && this.state.publishedAnalysis.length === 0 

        if (routerStore.browserConfig.env === 'dev'){
            console.log("this.props - AnalysisMenu" , this.props)
            console.log("this.state - AnalysisMenu", this.state)
        }
        return (
            <div id="YearAndRounds">
                 <p>{translate.intro_analysis_menu}</p>
           
                {/************************************************************************************* */}
                {/*                               SEMESTER DROPDOWN                          */}
                {/************************************************************************************* */}
                <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                    className='select-semester'
                >
                    <div className='inline-flex padding-top-30'>
                        <h3 > {translate.select_semester} </h3> 
                        <InfoButton addClass = 'padding-top-30' id = 'info_select_semester' textObj = {translate.info_select_semester}/>
                    </div>
                    
                    <DropdownToggle >
                        <span>
                            {this.state.semester && this.state.semester > 0 && !this.state.firstVisit
                                ? `${translate.course_short_semester[this.state.semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${this.state.semester.toString().match(/.{1,4}/g)[0]}`
                                : translate.select_semester
                            }
                        </span>
                        <span className='caretholder' id={'_spanCaret'}></span>
                    </DropdownToggle>
                    <DropdownMenu>
                        {semesterList && semesterList.map(semester =>
                            <DropdownItem id={semester} key={semester} onClick={this.handleSelectedSemester}>
                                {`
                                    ${translate.course_short_semester[semester.toString().match(/.{1,4}/g)[1]]} 
                                    ${semester.toString().match(/.{1,4}/g)[0]}
                                `}
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
              
                {this.state.alert.length > 0
                    ? <Alert color='danger' className = 'margin-bottom-40'> {this.state.alert}</Alert>
                    : ''
                }
                
                {/************************************************************************************* */}
                {/*                        SELECT BUTTONS FOR ANALYSIS OR ROUNDS                        */}
                {/************************************************************************************* */}
                <Collapse isOpen={this.state.collapseOpen}>
                    <Row id='analysisMenuContainer'>
                        { showAllEmptyNew || showAllEmptyPublished
                            ? <Alert color='info' className = 'margin-bottom-40'>
                                <p>{showAllEmptyNew ? translate.alert_no_rounds : translate.alert_no_published }</p>
                            </Alert>
                            :<Form> 
                                <div className='inline-flex'>
                                    <h3>{translate.header_analysis_menu}</h3>
                                    <InfoButton addClass = 'padding-top-30' id = 'info_choose_course_offering' textObj = {translate.info_choose_course_offering}/>
                                </div>
                   
                                {status === 'new' || status === 'draft' 
                                    ? <div className= 'selectBlock'>
                                        {/************************************************************************************* */}
                                        {/*                              DRAFT ANALYSIS                                          */}
                                        {/************************************************************************************* */}
                                        {this.state.draftAnalysis.length > 0
                                        ?<FormGroup id='drafts'>
                                            <p>{translate.intro_draft}</p>
                                            <ul className='no-padding-left'>
                                            {this.state.draftAnalysis.map(analysis =>
                                                <li className = 'select-list' key={analysis.analysisId}>
                                                    < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                        <Input type="radio"
                                                            id={`${!analysis.hasAccess ? analysis.analysisId +'_preview' : analysis.analysisId }`}
                                                            key={analysis.analysisId}
                                                            value={analysis.analysisId}
                                                            onChange={this.handleSelectedDraft}
                                                            checked={this.state.selectedRadio.draft === analysis.analysisId}
                                                            //disabled ={!analysis.hasAccess}
                                                        />
                                                        {analysis.analysisName}  <span className='no-access'>  {analysis.hasAccess ? '' : translate.not_authorized_course_offering }</span>
                                                    </Label>
                                                    <br />
                                                </li>
                                            )}
                                            </ul>
                                        </FormGroup>
                                        : ''
                                    }
                                    
                           
                                    
                                    {/************************************************************************************* */}
                                    {/*                               NEW ANALYSIS                                          */}
                                    {/************************************************************************************* */}
                                        {roundList[this.state.semester].length > this.state.usedRounds.length
                                            ? <FormGroup id='rounds'>
                                                <p>{translate.intro_new}</p>
                                                <ul className='no-padding-left'> 
                                                    {roundList[this.state.semester].map(round =>
                                                        this.state.usedRounds.indexOf(round.roundId) < 0
                                                            ? <li className = 'select-list' key={round.roundId}>
                                                                <Label key={"Label" + round.roundId}
                                                                    for={round.roundId}
                                                                >
                                                                    <Input type="checkbox"
                                                                        id={round.roundId}
                                                                        key={"checkbox" + round.roundId}
                                                                        onChange={this.handleRoundCheckbox}
                                                                        checked = {this.state.rounds.indexOf(round.roundId) > -1 }
                                                                        name={round.roundId}
                                                                        disabled = {!round.hasAccess}
                                                                        data-uid={round.ladokUID}
                                                                        data-enddate = {round.endDate}
                                                                    />
                                                                    {round.shortName 
                                                                        ? round.shortName + ' '
                                                                        : `${translate.course_short_semester[this.state.semester.toString().match(/.{1,4}/g)[1]]} 
                                                                        ${this.state.semester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `
                                                                    } 
                                                                    ( {translate.label_start_date} {getDateFormat(round.startDate, round.language)}, {round.language} )
                                                                    <span className='no-access'>   {round.hasAccess ? '' : translate.not_authorized_publish_new}</span>

                                                                </Label>
                                                                <br />
                                                            </li>
                                                        : ''
                                                    )}
                                                </ul>
                                            </FormGroup>
                                            : ''
                                        }
                                   
                                </div>
                                : <div className= 'selectBlock'>
                                    <FormGroup >
                                    {/************************************************************************************* */}
                                    {/*                               PUBLISHED ANALYSIS                                    */}
                                    {/************************************************************************************* */}
                                        {this.state.publishedAnalysis.length > 0
                                            ?  <div>
                                                <p>{translate.intro_published}</p><ul className='no-padding-left'>
                                                
                                                {
                                                    this.state.publishedAnalysis.map(analysis =>
                                                        <li className = 'select-list' key={analysis.analysisId}>
                                                            < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                                <Input type="radio"
                                                                    id={`${!analysis.hasAccess ? analysis.analysisId +'_preview' : analysis.analysisId }`}
                                                                    key={analysis.analysisId}
                                                                    value={analysis.analysisId}
                                                                    onChange={this.handleSelectedPublished}
                                                                    checked={this.state.selectedRadio.published === analysis.analysisId}
                                                                    //disabled = {!analysis.hasAccess}
                                                                />
                                                            {analysis.analysisName} <span className='no-access'>  {analysis.hasAccess ? '' : translate.not_authorized_course_offering }</span>
                                                            </Label>
                                                            <br />
                                                        </li>
                                                    )}
                                                </ul>
                                                </div>
                                            : <p>{translate.published_empty}</p>
                                        }
                                    </FormGroup>
                                </div>
                                }
                            </Form>
                            }
                    </Row>
                </Collapse>
                {/************************************************************************************* */}
                {/*                             BUTTONS FOR ANALYSIS MENU                               */}
                {/************************************************************************************* */}
                <Row className="button-container text-center">
                    <Col sm="12" lg="4">
                        { this.state.selectedRadio.draft.length > 0 && !this.state.canOnlyPreview
                            ? <span>
                                <Button color='danger' id='delete' key='delete' onClick={this.toggleModal} style={{marginRight: '5px'}}>
                                    {translate.btn_delete}
                                </Button>
                                <Button color='secondary' id='copy' key='copy' onClick={this.toggleModal} >
                                    {translate.btn_copy}
                                </Button>
                            </span>
                            : ''
                        }
                    </Col>
                    <Col sm="12" lg="4">
                        <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                            {translate.btn_cancel}
                        </Button>
                    </Col>
                    <Col sm="12" lg="4">
                        { !this.state.firstVisit && this.showEditButton() && !this.state.canOnlyPreview
                                ?<div>
                                    <Button className='loading-button' color='success' id='new' key='new' onClick={this.goToEditMode} disabled ={this.state.firstVisit}>
                                        <Spinner size='sm' className={this.state.ladokLoading && this.state.statisticsParams.ladokId.length ? 'loading-button-spinner-loading' : 'loading-button-spinner'} />
                                        <div>{translate.btn_add_analysis}</div>
                                        <div className="iconContainer arrow-forward" id='new' />
                                    </Button>
                            </div>
                            : ''
                        }
                        { this.state.canOnlyPreview
                                ? <Button color='success' id='new' key='new' onClick={this.handlePreview}>
                                    <div className="iconContainer arrow-forward" id='new' />  
                                    {translate.btn_preview}
                            </Button>
                            : ''
                        }
                    </Col>
                </Row>
                {/************************************************************************************* */}
                {/*                               MODALS FOR DELETE AND COPY                            */}
                {/************************************************************************************* */}  
                <InfoModal type = 'delete' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.delete} id={this.state.selectedRadio.draft} handleConfirm={this.handleDelete} infoText={translate.info_delete}/>
                <InfoModal type = 'copy' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.copy} 
                id={'copy'} 
                url={`${routerStore.browserConfig.hostUrl}${routerStore.browserConfig.proxyPrefixPath.uri}/preview/${this.state.selectedRadio.draft}?title=${encodeURI(routerStore.courseTitle.name+'_'+routerStore.courseTitle.credits)}`} 
                infoText={translate.info_copy_link}
                copyHeader = {translate.header_copy_link}/>
            </div>
        )
    }
}

export default AnalysisMenu

