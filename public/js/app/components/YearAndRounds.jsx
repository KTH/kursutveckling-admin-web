import React, { Component } from 'react'
import {Card, CardBody, Form, Dropdown, FormGroup, Label, Input, Collapse, DropdownToggle, DropdownItem, DropdownMenu, Button} from 'reactstrap'

class YearAndRounds extends Component{
    constructor(props){
        super(props)
        this.state ={
            dropdownOpen: false,
            collapseOpen:false,
            semester: this.props.semesterList[0], 
            rounds: []
        }

       this.toggleDropdown = this.toggleDropdown.bind(this)
       this.handleSelectedSemester = this.handleSelectedSemester.bind(this)
       this.goToEditMode = this.goToEditMode.bind(this)
       this.handleRoundCheckbox = this.handleRoundCheckbox.bind(this)
    }

    toggleDropdown(event){
        event.preventDefault()
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        })
    }

    handleSelectedSemester(event){
        event.preventDefault()
        this.setState({
            collapseOpen: true,
            semester: event.target.id
        })
    }

    handleRoundCheckbox(event){
        if(event.target.checked)
            this.state.rounds.push(event.target.id)
        else
            this.state.rounds.splice(this.state.rounds.indexOf(event.target.id), 1);
    }

    goToEditMode(event){
        
        this.props.editMode(this.state.semester, this.state.rounds)
    }

    render () {
        return(
            <div id="YearAndRounds">
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
           

                <Collapse isOpen={this.state.collapseOpen}>
                <Card>
                <CardBody>
                <Form>
                    <FormGroup >
                    {this.props.roundList[this.state.semester].map(round =>
                    <span>
                     <br/>
                        <Label key={"Label"+round.roundId} for={round.roundId}>
                           <Input type="checkbox" id={round.roundId} key={"checkbox"+round.roundId} onClick={this.handleRoundCheckbox}/>
                            {round.shortName.length > 0 ? round.shortName : round.startDate} ({round.language}) 
                       </Label>
                       </span>
                    )}
                    </FormGroup>
                </Form>
               
                <Button  onClick={this.goToEditMode}>{'GO!'}</Button>
                </CardBody>
                </Card>
                </Collapse>
                -----------------------------------------------------------------------------------------------------
            </div>
        )
    }
}

export default YearAndRounds