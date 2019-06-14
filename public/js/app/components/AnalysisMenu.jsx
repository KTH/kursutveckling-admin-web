import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Form, Dropdown, FormGroup, Label, 
        Input, Collapse, DropdownToggle, DropdownItem, 
        DropdownMenu, Button, Row, Col } from 'reactstrap'

//Custom components
import InfoModal from './InfoModal'
import InfoButton from './InfoButton'

import i18n from '../../../../i18n/index'
import { EMPTY, ADMIN_URL } from '../util/constants'
import { getDateFormat } from '../util/helpers'

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
                info: false
            },
            semester: this.props.activeSemester && this.props.activeSemester.length > 0  ? this.props.activeSemester   : this.props.semesterList[0],
            rounds: [],
            usedRounds: this.props.routerStore.usedRounds.usedRounds ? this.props.routerStore.usedRounds.usedRounds  : [],
            draftAnalysis: this.props.routerStore.usedRounds.draftAnalysis ? this.props.routerStore.usedRounds.draftAnalysis : [],
            publishedAnalysis: this.props.routerStore.usedRounds.publishedAnalysis ? this.props.routerStore.usedRounds.publishedAnalysis : [],
            selectedRadio: {
                draft: '',
                published:'',
            },
            lastSelected: ''
        }

        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
        this.goToEditMode = this.goToEditMode.bind(this)
        this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
        this.handleSelectedDraft = this.handleSelectedDraft.bind(this)
        this.handleSelectedPublished = this.handleSelectedPublished.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    componentDidMount() {

       /*  this._isMounted = true;
        window.onpopstate = ()=> {
          if(this._isMounted) {
            console.log('this.super.state', this.super)
           const { hash } = location;
            if( this.state.value!==0)
              this.setState({value: 0})
            if(hash.indexOf('users')>-1 && this.state.value!==1)
              this.setState({value: 1})
            if(hash.indexOf('data')>-1 && this.state.value!==2)
              this.setState({value: 2})*/
         // }
       // }
      }

    componentWillMount() {
        const routerStore = this.props.routerStore
        if (routerStore.usedRounds.length === 0 || routerStore.hasChangedStatus)
            this.getUsedRounds(this.state.semester)
        else
            if (this.props.progress === 'new_back')
                this.setState({
                    semester: this.state.semester,
                    usedRounds: routerStore.usedRounds.usedRounds,
                    draftAnalysis: routerStore.usedRounds.draftAnalysis,
                    publishedAnalysis: routerStore.usedRounds.publishedAnalysis,
                    alert: ''
                })
    }

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
        this.getUsedRounds(event.target.id)
        this.setState({
            semester: event.target.id,
            collapseOpen: true,
            firstVisit: false,
            rounds:[],
            lastSelected:'',
            selectedRadio: radios
        })
    }

    getUsedRounds(semester) {
        const thisInstance = this
        const routerStore = this.props.routerStore
        return this.props.routerStore.getUsedRounds(this.props.routerStore.courseData.courseCode, semester)
            .then(result => {
                thisInstance.setState({
                    semester: semester,
                    usedRounds: routerStore.usedRounds.usedRounds,
                    draftAnalysis: routerStore.usedRounds.draftAnalysis,
                    publishedAnalysis: routerStore.usedRounds.publishedAnalysis,
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
    //************************ CHECKBOXES AND RADIO BUTTONS **************************** */

    handleRoundCheckbox(event) {
        let prevState = this.state

        if ( this.state.alert.length > 0 )
            prevState.alert = ''

        if ( event.target.checked ){
            prevState.selectedRadio.draft = null
            prevState.rounds.push(event.target.id)
            prevState.lastSelected = 'new'
            this.setState(prevState)
        }
        else{
            prevState.rounds.splice(this.state.rounds.indexOf(event.target.id), 1)
            this.setState(prevState)
        }
        
    }

    handleSelectedDraft(event) {
        let prevState = this.state
        prevState.rounds =[]
        prevState.selectedRadio.draft = event.target.id
        prevState.lastSelected = 'draft'
        prevState.alert = ''
        this.setState(prevState)
    }

    handleSelectedPublished(event) {
        let prevState = this.state
        prevState.selectedRadio.published = event.target.id
        prevState.lastSelected = 'published'
        prevState.alert = ''
        this.setState(prevState)
    }


    //************************ SUBMIT BUTTONS **************************** */

    goToEditMode(event) {
        event.preventDefault()
        if (this.state.rounds.length > 0 || this.state.selectedRadio.published.length > 0 || this.state.selectedRadio.draft.length > 0 )
            if(this.state.lastSelected === 'new')
                this.props.editMode(this.state.semester, this.state.rounds, null, this.state.lastSelected)
            else
                this.props.editMode(this.state.semester, null, this.state.selectedRadio[this.state.lastSelected],  this.state.lastSelected)
        else
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
    }

   /* goToPreviewMode(event) {
        event.preventDefault()
        console.log(event.target)
        if (this.state.selectedRadio[event.target.id].length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, this.state.selectedRadio[event.target.id], event.target.id)
        else
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
    }*/

    handleCancel(event) {
        event.preventDefault()
        window.location=`${SERVICE_URL[this.props.routerStore.service]}${this.props.routerStore.analysisData.courseCode}?serv=kutv&event=cancel`
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
                window.location=`${ADMIN_URL}${this.props.routerStore.courseCode}?serv=kutv&event=delete`
                this.getUsedRounds(this.state.semester)
                let modalOpen = this.state.modalOpen
                modalOpen.delete = ! modalOpen.delete === true
                this.setState({
                    modalOpen: modalOpen
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

    render() {
        
        const { status, semesterList, roundList, routerStore } = this.props
        const translate = i18n.messages[routerStore.language].messages
        const showAllEmptyNew = status !== 'published' && this.state.draftAnalysis.length === 0 && roundList[this.state.semester].length === this.state.usedRounds.length
        const showAllEmptyPublished = status === 'published' && this.state.publishedAnalysis.length === 0 

        console.log("routerStore", this.props, i18n.messages)
        console.log("this.state", this.state)
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
                    <div className='inline-flex'>
                        <h3 > {translate.select_semester} </h3> 
                        <InfoButton id = 'info_select_semester' textObj = {translate.info_select_semester}/>
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
                <br />
                {this.state.alert.length > 0
                    ? <Alert color='danger'> {this.state.alert}</Alert>
                    : ''
                }

                <Collapse isOpen={this.state.collapseOpen}>
                <Row id='analysisMenuContainer'>
                    {
                      showAllEmptyNew || showAllEmptyPublished
                      ?  
                      <Alert color='info'>
                          <p>{showAllEmptyNew ? 'new empty' :'published empty'}</p>
                      </Alert>
                    :<Form> 
                         <div className='inline-flex'>
                             <h3>{translate.header_analysis_menu}</h3>
                            <InfoButton id = 'info_choose_course_offering' textObj = {translate.info_choose_course_offering}/>
                            <InfoModal type = 'info' toggle= {this.toggleModal}  isOpen = {this.state.modalOpen.info} id='choose_course_offering' infoText={translate.info_choose_course_offering}/>
                        </div>
                   
                        {status === 'new' || status === 'draft' 
                        ? <span>
                            <FormGroup>
                            {/************************************************************************************* */}
                            {/*                              DRAFT ANALYSIS                                          */}
                            {/************************************************************************************* */}
                                {this.state.draftAnalysis.length > 0
                                        ?<span>
                                            <p>{translate.intro_draft}</p>
                                            <ul>
                                            {this.state.draftAnalysis.map(analysis =>
                                                <li className = 'select-list' key={analysis.analysisId}>
                                                    < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                        <Input type="radio"
                                                            id={analysis.analysisId}
                                                            key={analysis.analysisId}
                                                            value={analysis.analysisId}
                                                            onChange={this.handleSelectedDraft}
                                                            checked={this.state.selectedRadio.draft === analysis.analysisId}
                                                        />
                                                        {analysis.analysisName}
                                                        {/*" ( Created by: " + analysis.user + " ) "*/}
                                                    </Label>
                                                    <br />
                                                </li>
                                            )}
                                        </ul>
                                     </span> 
                                    : ''
                                }
                            </FormGroup>
                           
                            <FormGroup >
                            {/************************************************************************************* */}
                            {/*                               NEW ANALYSIS                                          */}
                            {/************************************************************************************* */}
                                {roundList[this.state.semester].length > this.state.usedRounds.length
                                    ?  <div>
                                        {/* <h3>{translate.header_select_rounds}</h3>*/}
                                        <p>{translate.intro_new}</p>
                                        <ul> 
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
                                                            />
                                                            {round.shortName 
                                                                ? round.shortName + ' '
                                                                : `${translate.course_short_semester[this.state.semester.toString().match(/.{1,4}/g)[1]]} 
                                                                   ${this.state.semester.toString().match(/.{1,4}/g)[0]}-${round.roundId} `
                                                            } 
                                                             ( {translate.label_start_date} {getDateFormat(round.startDate, round.language)}, {round.language} )

                                                        </Label>
                                                        <br />
                                                    </li>
                                                : ''
                                            )}
                                        </ul>
                                    </div>
                                    : ''
                                }
                            </FormGroup>
                        </span>
                       : <FormGroup >
                        {/************************************************************************************* */}
                        {/*                               PUBLISHED ANALYSIS                                    */}
                        {/************************************************************************************* */}
                            {this.state.publishedAnalysis.length > 0
                                ?  <div>
                                {/* <h3>{translate.header_select_rounds}</h3>*/}
                                <p>{translate.intro_published}</p><ul>
                                    
                                    {
                                        this.state.publishedAnalysis.map(analysis =>
                                            <li className = 'select-list' key={analysis.analysisId}>
                                                < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                    <Input type="radio"
                                                        id={analysis.analysisId}
                                                        key={analysis.analysisId}
                                                        value={analysis.analysisId}
                                                        onChange={this.handleSelectedPublished}
                                                        checked={this.state.selectedRadio.published === analysis.analysisId}
                                                    />
                                                    {analysis.analysisName}
                                                    {/*" ( Created by: " + analysis.user + " ) "*/}
                                                </Label>
                                                <br />
                                            </li>
                                        )}
                                    </ul>
                                    </div>
                                : <p>{translate.published_empty}</p>
                            }
                        </FormGroup>
                        }
                    </Form>
                    }
                </Row>
                </Collapse>
                {/************************************************************************************* */}
                {/*                               BUTTONS ANALYSIS MENU                                         */}
                {/************************************************************************************* */}
                <Row className="button-container text-center">
                    <Col sm="6" lg="4">
                       {/**  <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                            {translate.btn_cancel}
                        </Button>*/}
                    </Col>
                    <Col sm="6" lg="4">
                        <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                            {translate.btn_cancel}
                        </Button>
                    </Col>
                    <Col sm="6" lg="4">
                        {
                            !this.state.firstVisit && this.showEditButton()
                                ? <Button color='success' id='new' key='new' onClick={this.goToEditMode} disabled ={this.state.firstVisit}>
                                    <div className="iconContainer arrow-forward" id='new' />  
                                    {translate.btn_add_analysis}
                            </Button>
                            : ''
                        }
                    </Col>
                </Row>
                <InfoModal type = 'delete' toggle= {this.toggleModal} isOpen = {this.state.modalOpen.delete} id={this.state.selectedRadio.draft} handleConfirm={this.handleDelete} infoText={translate.info_delete}/>
            </div>
        )
    }
}

export default AnalysisMenu

