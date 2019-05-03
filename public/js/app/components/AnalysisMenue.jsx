import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Form, Dropdown, FormGroup, Label, Input, Collapse, DropdownToggle, DropdownItem, DropdownMenu, Button } from 'reactstrap'

import i18n from '../../../../i18n/index'

@inject(['routerStore']) @observer
class AnalysisMenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: '',
            firstVisit: this.props.firstVisit,
            dropdownOpen: false,
            collapseOpen: this.props.progress === 'back_new',
            semester: this.props.activeSemester && this.props.activeSemester.length > 0 
                        ? this.props.activeSemester 
                        : this.props.semesterList[0],
            rounds: [],
            usedRounds: this.props.routerStore.usedRounds.usedRounds 
                            ? this.props.routerStore.usedRounds.usedRounds 
                            : [],
            draftAnalysis: this.props.routerStore.usedRounds.draftAnalysis 
                            ? this.props.routerStore.usedRounds.draftAnalysis 
                            : [],
            publishedAnalysis: this.props.routerStore.usedRounds.publishedAnalysis ? this.props.routerStore.usedRounds.publishedAnalysis : [],
            selectedRadio: {
                draft: this.props.routerStore.usedRounds.draftAnalysis && this.props.routerStore.usedRounds.draftAnalysis.length === 1 
                        ? this.props.routerStore.usedRounds.draftAnalysis[0].analysisId 
                        : '',
                published: this.props.routerStore.usedRounds.publishedAnalysis && this.props.routerStore.usedRounds.publishedAnalysis.length === 1 
                            ? this.props.routerStore.usedRounds.publishedAnalysis[0].analysisId 
                            : '',
            }
        }

        this.toggleDropdown = this.toggleDropdown.bind(this)
        this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
        this.goToEditMode = this.goToEditMode.bind(this)
        this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
        this.handleSelectedDraft = this.handleSelectedDraft.bind(this)
        this.handleSelectedPublished = this.handleSelectedPublished.bind(this)
        this.goToPreviewMode = this.goToPreviewMode.bind(this)
        this.handleCancel = this.handleCancel.bind(this)


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
                    selectedRadio: {
                        draft: routerStore.usedRounds.draftAnalysis.length === 1 ? routerStore.usedRounds.draftAnalysis[0].analysisId : '',
                        published: routerStore.usedRounds.publishedAnalysis.length === 1 ? routerStore.usedRounds.publishedAnalysis[0].analysisId : '',
                    },
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
        this.getUsedRounds(event.target.id)
        this.setState({
            semester: event.target.id,
            collapseOpen: true,
            firstVisit: false
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
                    selectedRadio: {
                        draft: routerStore.usedRounds.draftAnalysis.length === 1 ? routerStore.usedRounds.draftAnalysis[0].analysisId : '',
                        published: routerStore.usedRounds.publishedAnalysis.length === 1 ? routerStore.usedRounds.publishedAnalysis[0].analysisId : '',
                    },
                    alert: ''
                })
            })
    }
    //************************ CHECKBOXES AND RADIO BUTTONS **************************** */

    handleRoundCheckbox(event) {
        if ( event.target.checked )
            this.state.rounds.push(event.target.id)
        else
            this.state.rounds.splice(this.state.rounds.indexOf(event.target.id), 1)

        if ( this.state.alert.length > 0 )
            this.setState({
                alert: ''
            })
    }

    handleSelectedDraft(event) {
        let prevState = this.state
        prevState.selectedRadio.draft = event.target.id
        prevState.alert = ''
        this.setState(prevState)
    }

    handleSelectedPublished(event) {
        let prevState = this.state
        prevState.selectedRadio.published = event.target.id
        prevState.alert = ''
        this.setState(prevState)
    }


    //************************ SUBMIT BUTTONS **************************** */
    goToEditMode(event) {
        event.preventDefault()
        if (this.state.rounds.length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, null, 'new')
        else
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
    }

    goToPreviewMode(event) {
        event.preventDefault()
        if (this.state.selectedRadio[event.target.id].length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, this.state.selectedRadio[event.target.id], event.target.id)
        else
            this.setState({
                alert: i18n.messages[this.props.routerStore.language].messages.alert_no_rounds_selected
            })
    }

    handleCancel(event) {
        event.preventDefault()
        alert('THIS IS WILL TAKE YOU BACK TO KURSINFO ADMIN IN THE FUTURE')
      }




    render() {
        const translate = i18n.messages[this.props.routerStore.language].messages
        console.log("routerStore", this.props)
        console.log("this.state", this.state, translate)
       
        return (
            <div id="YearAndRounds">
                <h4>{translate.header_select_semester}</h4>
                {/**** Select semester for a course *****/}
                <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                    className='select-semester'
                >
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
                                    {this.props.semesterList && this.props.semesterList.map(semester =>
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
                    <Form>
                        {/**** DRAFT ANALYSIS ****/}
                        <FormGroup >
                            <h3>{translate.header_added_rounds}</h3>
                            <h4>{translate.header_draft}</h4>
                            {this.state.draftAnalysis.length > 0
                                ? this.state.draftAnalysis.length > 1
                                    ? <ul>
                                        {this.state.draftAnalysis.map(analysis =>
                                            <li className = 'select-list' key={analysis.analysisId}>
                                                < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                    <Input type="radio"
                                                        id={analysis.analysisId}
                                                        key={analysis.analysisId}
                                                        onChange={this.handleSelectedDraft}
                                                        checked={this.state.selectedRadio.draft === analysis.analysisId}
                                                    />
                                                    {analysis.analysisName}
                                                    {" ( Created by: " + analysis.user + " ) "}
                                                </Label>
                                                <br />
                                            </li>
                                        )}
                                    </ul>
                                    : <ul>
                                        <li className = 'select-list'>
                                            <Label key={"Label" + this.state.draftAnalysis[0].analysisId} for={this.state.draftAnalysis[0].analysisId} >
                                                {this.state.draftAnalysis[0].analysisName}
                                                {" ( Created by: " + this.state.draftAnalysis[0].user + " ) "}
                                            </Label>
                                        </li>
                                    </ul>
                                : <p>{translate.draft_empty}</p>
                            }
                            <div className="button-container text-right" >
                                <Button color='danger' id='draft' key='draft' onClick={this.goToPreviewMode} disabled={this.state.draftAnalysis.length < 1} >
                                    {translate.btn_delete}
                                </Button>
                                <Button color='success' id='draft' key='draft' onClick={this.goToPreviewMode} disabled={this.state.draftAnalysis.length < 1} >
                                    <div className="iconContainer arrow-forward" />
                                    {translate.btn_preview}
                                </Button>
                            </div>
                        </FormGroup>

                        {/**** PUBLISHED ANALYSIS ****/}
                        <FormGroup >
                            <h4>{translate.header_published}</h4>
                            {this.state.publishedAnalysis.length > 0
                                ? this.state.publishedAnalysis.length > 1
                                    ? <ul>
                                        {this.state.publishedAnalysis.map(analysis =>
                                            <li className = 'select-list' key={analysis.analysisId}>
                                                < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                    <Input type="radio"
                                                        id={analysis.analysisId}
                                                        key={analysis.analysisId}
                                                        onChange={this.handleSelectedPublished}
                                                        checked={this.state.selectedRadio.published === analysis.analysisId}
                                                    />
                                                    {analysis.analysisName}
                                                    {" ( Created by: " + analysis.user + " ) "}
                                                </Label>
                                                <br />
                                            </li>
                                        )}
                                    </ul>
                                    : <ul>
                                        <li className = 'select-list'>
                                            <Label key={"Label" + this.state.publishedAnalysis[0].analysisId} for={this.state.publishedAnalysis[0].analysisId} >
                                                {this.state.publishedAnalysis[0].analysisName}
                                                {" ( Created by: " + this.state.publishedAnalysis[0].user + " ) "}
                                            </Label>
                                        </li>
                                    </ul>
                                : <p>{translate.published_empty}</p>
                            }
                            <div className="button-container text-right" >
                                <Button color='success' id='published' key='published' onClick={this.goToPreviewMode} disabled={this.state.publishedAnalysis.length < 1}>
                                    <div className="iconContainer arrow-forward" /> {
                                    translate.btn_preview}
                                </Button>
                            </div>
                        </FormGroup>

                        {/**** NEW ANALYSIS ****/}
                        <FormGroup >
                            <h3>{translate.header_new}</h3>

                            <h4>{translate.header_select_rounds}</h4>
                           
                            {this.props.roundList[this.state.semester].length > this.state.usedRounds.length
                                ?  <ul> 
                                    {this.props.roundList[this.state.semester].map(round =>
                                        this.state.usedRounds.indexOf(round.roundId) < 0
                                            ? <li className = 'select-list' key={round.roundId}>
                                                <Label key={"Label" + round.roundId}
                                                    for={round.roundId}
                                                >
                                                    <Input type="checkbox"
                                                        id={round.roundId}
                                                        key={"checkbox" + round.roundId}
                                                        onClick={this.handleRoundCheckbox}
                                                    />
                                                    {round.shortName ? round.shortName : round.startDate} {(round.language)}

                                                </Label>
                                                <br />
                                            </li>
                                            : ''
                                    )}
                                </ul>
                                : <p>{translate.new_empty}</p>
                            }
                            
                            <div className="button-container text-right" >
                                <Button color='success' id='new' key='new' onClick={this.goToEditMode} disabled ={this.props.roundList[this.state.semester].length === this.state.usedRounds.length}>
                                    <div className="iconContainer arrow-forward" />  
                                    {translate.btn_add_analysis}
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </Collapse>
                <div className="button-container text-center" >
                    <Button color='secondary' id='cancel' key='cancel' onClick={this.handleCancel} >
                        {translate.btn_cancel}
                    </Button>
                </div>

            </div>
        )
    }
}

export default AnalysisMenue