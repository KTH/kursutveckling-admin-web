import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Alert, Card, Form, Dropdown, FormGroup, Label, Input, Collapse, DropdownToggle, DropdownItem, DropdownMenu, Button } from 'reactstrap'

@inject(['routerStore']) @observer
class AnalysisMenue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: '',
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
        this.goTopPreviewMode = this.goTopPreviewMode.bind(this)


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
            collapseOpen: true
        })
    }

    getUsedRounds(semester) {
        const thisInstance = this
        const routerStore = this.props.routerStore
        return this.props.routerStore.getUsedRounds(this.props.routerStore.courseData.courseCode, semester)
            .then(result => {
                console.log("used rounds", routerStore.usedRounds)
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
                alert: 'selectRounds'
            })
    }

    goTopPreviewMode(event) {
        event.preventDefault()
        console.log(event.target.id)
        const selected = event.target.id
        if (this.state.selectedRadio[selected].length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, this.state.selectedRadio[selected], event.target.id)
        else
            this.setState({
                alert: selected
            })
    }




    render() {
        console.log("routerStore", this.props.routerStore)
        console.log("this.state", this.state)
        return (
            <div id="YearAndRounds">
                <h4>Select...</h4>
                <Dropdown
                    isOpen={this.state.dropdownOpen}
                    toggle={this.toggleDropdown}
                    className='select-semester'
                >
                    <DropdownToggle >
                        <span>
                            {this.props.activeSemester && this.props.activeSemester.length > 0
                                ? this.props.activeSemester
                                : 'Select semester'
                            }
                        </span>
                        <span className='caretholder' id={'_spanCaret'}></span>
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.props.semesterList && this.props.semesterList.map(semester =>
                            <DropdownItem id={semester} key={semester} onClick={this.handleSelectedSemester}>{semester}</DropdownItem>
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
                            <h3>Created...</h3>
                            <h4>Draft...</h4>
                            {this.state.draftAnalysis.length > 0
                                ? this.state.draftAnalysis.length > 1
                                    ? <ul>
                                        {this.state.draftAnalysis.map(analysis =>
                                            <li key={analysis.analysisId}>
                                                < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                    <Input type="radio"
                                                        id={analysis.analysisId}
                                                        key={analysis.analysisId}
                                                        onChange={this.handleSelectedDraft}
                                                        checked={this.state.selectedRadio.draft === analysis.analysisId}
                                                    />
                                                    {analysis.analysisName}
                                                    {" ( Created by " + analysis.user + " ) "}
                                                </Label>
                                                <br />
                                            </li>
                                        )}
                                    </ul>
                                    : <ul>
                                        <li>
                                            <Label key={"Label" + this.state.draftAnalysis[0].analysisId} for={this.state.draftAnalysis[0].analysisId} >
                                                {this.state.draftAnalysis[0].analysisName}
                                                {" ( Created by " + this.state.draftAnalysis[0].user + " ) "}
                                            </Label>
                                        </li>
                                    </ul>
                                : <p>{'no drafts ...'}</p>
                            }
                            <div className="button-container text-right" >
                                <Button color='success' id='draft' key='draft' onClick={this.goTopPreviewMode} disabled={this.state.draftAnalysis.length < 1} >
                                    {'Button Draft'}
                                </Button>
                            </div>
                        </FormGroup>

                        {/**** PUBLISHED ANALYSIS ****/}
                        <FormGroup >
                            <h4>Published ...</h4>
                            {this.state.publishedAnalysis.length > 0
                                ? this.state.publishedAnalysis.length > 1
                                    ? <ul>
                                        {this.state.publishedAnalysis.map(analysis =>
                                            <li className="input-list" key={analysis.analysisId}>
                                                < Label key={"Label" + analysis.analysisId} for={analysis.analysisId} >
                                                    <Input type="radio"
                                                        id={analysis.analysisId}
                                                        key={analysis.analysisId}
                                                        onChange={this.handleSelectedPublished}
                                                        checked={this.state.selectedRadio.published === analysis.analysisId}
                                                    />
                                                    {analysis.analysisName}
                                                    {" ( Created by " + analysis.user + " ) "}
                                                </Label>
                                                <br />
                                            </li>
                                        )}
                                    </ul>
                                    : <ul>
                                        <li>
                                            <Label key={"Label" + this.state.publishedAnalysis[0].analysisId} for={this.state.publishedAnalysis[0].analysisId} >
                                                {this.state.publishedAnalysis[0].analysisName}
                                                {" ( Created by " + this.state.publishedAnalysis[0].user + " ) "}
                                            </Label>
                                        </li>
                                    </ul>
                                : <p>{'no published ...'}</p>
                            }
                            <div className="button-container text-right" >
                                <Button color='success' id='published' key='published' onClick={this.goTopPreviewMode} disabled={this.state.publishedAnalysis.length < 1}>
                                    {'Button Published'}
                                </Button>
                            </div>
                        </FormGroup>

                        {/**** NEW ANALYSIS ****/}
                        <FormGroup >
                            <h3>New</h3>

                            <h4>Select rounds text :</h4>
                            {this.props.roundList[this.state.semester].length > this.state.usedRounds.length
                                ? this.props.roundList[this.state.semester].map(round =>
                                    this.state.usedRounds.indexOf(round.roundId) < 0
                                        ? <span key={round.roundId}>
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
                                        </span>
                                        : ''
                                )
                                : <p>{'All rounds used'}</p>
                            }
                            <div className="button-container text-right" >
                                <Button color='success' id='new' key='new' onClick={this.goToEditMode} disabled ={this.props.roundList[this.state.semester].length === this.state.usedRounds.length}>
                                    {'Button New'}
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                </Collapse>
                <div className="button-container text-center" >
                    <Button color='secondary' id='published' key='published' onClick={this.goTopPreviewMode} >
                        {'Cancel'}
                    </Button>
                </div>

            </div>
        )
    }
}

export default AnalysisMenue