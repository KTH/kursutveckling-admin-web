import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Form, Label, Input, Alert} from 'reactstrap'
import i18n from '../../../../i18n/index'

//Components
import Title from '../components/Title'

//Helpers 
import { EMPTY, ADMIN_URL} from '../util/constants'
const labelIdle = 'Drag & Drop filen här <span class="filepond--label-action"> eller öppna utforskaren </span>'

@inject(['routerStore']) @observer
class AnalysisForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
   
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
   this.props.handleInputChange(event)
  }
  

  render () {
    const routerStore = this.props.routerStore
    const isDisabled =  this.state.isPublished === true

    const {translate} = this.props
  
    //console.log("routerStore", routerStore)
    //console.log( "this.state", this.state)
    return (
      <Col sm='4' className='col-temp'>
      <h4>{translate.header_summarize}</h4>

      <span className='inline-flex'>
        <Label>{translate.header_course_changes_comment}</Label>
          <InfoButton id = 'info_course_changes_comment' textObj = {translate.info_course_changes_comment}/>
      </span>
      <Input style={{ height: 300 }} id='alterationText' key='alterationText' type="textarea" 
        value={this.state.values.alterationText} 
        onChange={this.handleInputChange} 
      />
    </Col>  

      <Col sm='4' className='col-temp'>
        <h4>{translate.header_check_data}</h4>
        <p>{translate.asterix_text}</p>

        <span className='inline-flex'>
          <Label>{translate.header_registrated} *</Label>
          <InfoButton id = 'info_registrated' textObj = {translate.info_registrated}/>
        </span>
        <Input id='registeredStudents' key='registeredStudents' type='number' 
          placeholder = '0' 
          value={this.state.values.registeredStudents} 
          onChange={this.handleInputChange} disabled={isPublished} 
          className = {this.state.notValid.indexOf('registeredStudents') > -1 ? 'not-valid' : ''}
        />
        
        <span className='inline-flex'>
          <Label>{translate.header_examination_grade} *</Label>
          <InfoButton id = 'info_examination_grade' textObj = {translate.info_examination_grade}/>
        </span>
        <Input id='examinationGrade' key='examinationGrade' type='number' 
          placeholder = '0' 
          value={this.state.values.examinationGrade} 
          onChange={this.handleInputChange} disabled={isPublished} 
          className = {this.state.notValid.indexOf('examinationGrade') > -1 ? 'not-valid' : ''}
          />
        
        
        <span className='inline-flex'>
          <Label>{translate.header_examiners} *</Label>
          <InfoButton id = 'info_examiners' textObj = {translate.info_examiners}/>
        </span>
        <Input id='examiners' key='examiners' type='text' 
          value={this.state.values.examiners} 
          onChange={this.handleInputChange} 
          disabled={isPublished}
          className = {this.state.notValid.indexOf('examiners') > -1 ? 'not-valid' : ''}

        />
       
        <span className='inline-flex'>
          <Label>{translate.header_responsibles} *</Label>
          <InfoButton id = 'info_responsibles' textObj = {translate.info_responsibles}/>
        </span>
        <Input id='responsibles' key='responsibles' type='text' 
          value={this.state.values.responsibles} 
          onChange={this.handleInputChange} 
          disabled={isPublished} 
          className = {this.state.notValid.indexOf('responsibles') > -1 ? 'not-valid' : ''}
          />

        { isPublished
        ? <span>
            <span className='inline-flex'>
              <Label>{translate.header_analysis_edit_comment}</Label>
              <InfoButton id = 'info_edit_comments' textObj = {translate.info_edit_comments}/>
           </span>
          <Input id='commentChange' key='commentChange' type="textarea" 
            value={this.state.values.commentChange} 
            onChange={this.handleInputChange} 
            className = {this.state.notValid.indexOf('commentChange') > -1 ? 'not-valid' : ''}
          />
        </span>
        : ''
        }
      </Col>
      
      
  )
}
}


export default AdminPage
