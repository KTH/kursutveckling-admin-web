import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {Alert, Card, CardBody, Form, Dropdown, FormGroup, Label, Input, Collapse, DropdownToggle, DropdownItem, DropdownMenu, Button} from 'reactstrap'

@inject(['routerStore']) @observer
class YearAndRounds extends Component{
    constructor(props){
        super(props)
        this.state ={
            dropdownOpen: false,
            collapseOpen:false,
            semester: this.props.semesterList[0], 
            rounds: [],
            selectedRadio:{
                draft: '',
                published: ''
            },
            usedRounds:[],
            draftAnalysis:[],
            publishedAnalysis:[],
        }

       this.toggleDropdown = this.toggleDropdown.bind(this)
       this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
       this.goToEditMode = this.goToEditMode.bind(this)
       this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
       this.handleSelectedDraft = this.handleSelectedDraft.bind(this)
       this.handleSelectedPublished = this.handleSelectedPublished.bind(this)
       this.goTopPreviewMode = this.goTopPreviewMode.bind(this)
       
       
    }

    toggleDropdown(event){
        event.preventDefault()
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        })
    }

    handleSelectedSemester(event){
        event.preventDefault()
        const semester = event.target.id
        this.props.routerStore.getUsedRounds(this.props.routerStore.courseCode, semester)
        .then( result =>{
            console.log("used rounds", result.data)
            this.setState({
                collapseOpen: true,
                semester: semester,
                usedRounds:result.data.usedRounds,
                draftAnalysis:result.data.draftAnalysis,
                publishedAnalysis:result.data.publishedAnalysis,
                selectedRadio:{
                    draft: result.data.draftAnalysis.length === 1 ? result.data.draftAnalysis.analysisId : '',
                    published: result.data.publishedAnalysis.length === 1 ? result.data.publishedAnalysis.analysisId : '',
                },
                alert: ''
            })
        })
    }

    //************************ CHECKBOXES AND RADIO BUTTONS **************************** */

    handleRoundCheckbox(event){
        if(event.target.checked)
            this.state.rounds.push(event.target.id)
        else
            this.state.rounds.splice(this.state.rounds.indexOf(event.target.id), 1)

        if(this.state.alert === 'selectRounds')
            this.setState({
                alert:''
        })
    }

    handleSelectedDraft(event){
       let prevState = this.state
        prevState.selectedRadio.draft = event.target.id
        
        this.setState(prevState)
    }
    
    handleSelectedPublished(event){
        console.log(event.target.id)
      let  prevState = this.state
        prevState.selectedRadio.published = event.target.id
        
        this.setState(prevState)
        //this.state.selectedRadio.published = event.target.id

    }
//************************ SUBMIT BUTTONS **************************** */
    goToEditMode(event){
        event.preventDefault()
        if(this.state.rounds.length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, 'new')
        else
        this.setState({
            alert: 'selectRounds'
        })
    }

    goTopPreviewMode(event){
        event.preventDefault()
        console.log(event.target.id)
        const selected = event.target.id
        if(this.state.selectedRadio[selected].length > 0)
            this.props.editMode(this.state.semester, this.state.rounds, selected)  
        else
        this.setState({
            alert: selected
        })
    }




    render () {
        console.log("routerStore", this.props.routerStore)
        console.log( "this.state", this.state)
        return(
            <div id="YearAndRounds">
                <h4>Select...</h4>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                    <DropdownToggle caret>
                        Select semester
                    </DropdownToggle>
                    <DropdownMenu>
                        {this.props.semesterList && this.props.semesterList.map(semester =>
                            <DropdownItem id={semester} key={semester} onClick={this.handleSelectedSemester}>{semester}</DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
                <br/>
                {this.state.alert === 'selectRounds'
                    ?<Alert> {this.state.alert}</Alert>
                    :''
                }

                <Collapse isOpen={this.state.collapseOpen}>
                <Form>
                     {/**** NEW ANALYSIS ****/}
                    <FormGroup >
                        <h3>New</h3>
                        
                        <h4>Select rounds text :</h4>
                           {this.props.roundList[this.state.semester].length > this.state.usedRounds.length
                                ? this.props.roundList[this.state.semester].map(round =>
                                    this.state.usedRounds.indexOf(round.roundId) < 0
                                        ? <span key={round.roundId}>
                                            <Label key={"Label"+round.roundId} 
                                                for={round.roundId} 
                                            >
                                                <Input type="checkbox" 
                                                    id={round.roundId} 
                                                    key={"checkbox"+round.roundId} 
                                                    onClick={this.handleRoundCheckbox} 
                                                />
                                                {round.shortName ? round.shortName : round.startDate } {(round.language)}
                                        
                                            </Label>
                                            <br/>
                                        </span>
                                        :''
                                )
                            : <p>{'All rounds used'}</p>
                            }
                        <Button id='new' key ='new' onClick={this.goToEditMode} >
                            {'Button New'}
                        </Button>
                    </FormGroup>
                  {/**** DRAFT ANALYSIS ****/}
                    <FormGroup >
                        <h3>Created...</h3>
                        <h4>Draft...</h4>
                        { this.state.draftAnalysis.length > 0
                            ? this.state.draftAnalysis.length > 1
                                ?<ul> 
                                    {this.state.draftAnalysis.map( analysis  => 
                                        <li key={analysis.analysisId}>
                                            < Label key={"Label"+analysis.analysisId} for={analysis.analysisId} >
                                                <Input type="radio" 
                                                    id={analysis.analysisId} 
                                                    key={analysis.analysisId} 
                                                    onChange={this.handleSelectedDraft}
                                                    checked ={this.state.selectedRadio.draft === analysis.analysisId}
                                                />
                                                {analysis.analysisName} 
                                                {" ( Created by " + analysis.user +" ) "}
                                            </Label>
                                            <br/>
                                        </li>
                                    )}
                                </ul>
                                :<ul> 
                                    <li>
                                        <Label key={"Label"+this.state.draftAnalysis[0].analysisId} for={this.state.draftAnalysis[0].analysisId} >
                                            {this.state.draftAnalysis[0].analysisName} 
                                            {" ( Created by " + this.state.draftAnalysis[0].user +" ) "}
                                        </Label>
                                    </li>
                                </ul>
                            :<p>{'no drafts ...'}</p>
                        }
                        <Button id='draft' key ='draft' onClick={this.goTopPreviewMode} >
                            {'Button Draft'}
                        </Button>
                    </FormGroup>

                    {/**** PUBLISHED ANALYSIS ****/}
                    <FormGroup >
                        <h4>Published ...</h4>
                        {this.state.publishedAnalysis.length > 0
                            ?this.state.publishedAnalysis.length > 1
                                ?<ul> 
                                    {this.state.publishedAnalysis.map( analysis  => 
                                        <li className = "input-list" key={analysis.analysisId}>
                                            < Label key={"Label"+analysis.analysisId} for={analysis.analysisId} >
                                                <Input type="radio" 
                                                    id={analysis.analysisId} 
                                                    key={analysis.analysisId} 
                                                    onChange={this.handleSelectedPublished} 
                                                    checked ={this.state.selectedRadio.published === analysis.analysisId}
                                                />
                                                {analysis.analysisName} 
                                                {" ( Created by " + analysis.user +" ) "}
                                            </Label>
                                            <br/>
                                        </li>
                                    )}
                                </ul>
                                : <ul>
                                    <li>
                                        <Label key={"Label"+this.state.publishedAnalysis[0].analysisId} for={this.state.publishedAnalysis[0].analysisId} >
                                            {this.state.publishedAnalysis[0].analysisName} 
                                            {" ( Created by " + this.state.publishedAnalysis[0].user +" ) "}
                                        </Label>
                                    </li>
                                </ul>
                            :<p>{'no published ...'}</p>
                        }
                        <Button id='published' key ='published' onClick={this.goTopPreviewMode} >
                            {'Button Published'}
                        </Button>
                    </FormGroup>
                </Form>
            </Collapse>
                -----------------------------------------------------------------------------------------------------
        </div>
        )
    }
}

export default YearAndRounds