import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Button, Form, Label, Input, Alert} from 'reactstrap'



import i18n from '../../../../i18n/index'

//Components

//Helpers 
import { EMPTY, ADMIN_URL} from '../util/constants'

@inject(['routerStore']) @observer
class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isPublished: this.props.routerStore.roundAnalysis === 'published',
      isNew: this.props.routerStore.roundAnalysis === 'new',
      values: this.props.values
    }
   
    this.handleSave = this.handleSave.bind(this)
    this.handlePublish = this.handlePublish.bind(this)
  }
  
  handleSave (event) {
    event.preventDefault()
    const postObject = this.state.values
    const thisInstance = this
    this.props.history.push(this.props.routerStore.browserConfig.proxyPrefixPath.uri +'/'+ this.props.routerStore.analysisId)
    console.log('postObject', postObject)
    return this.props.routerStore.postRoundAnalysisData(postObject, this.state.isNew)
   .then((data) => {
     thisInstance.setState({
       saved: true,
       isNew: false
     })
   })
  }

  handlePublish (event) {
    event.preventDefault()
    let postObject = this.state.values
    postObject.isPublished = true
    const thisInstance = this
    console.log('postObjecteeee', this.state.values.isPublished)
    return this.props.routerStore.postRoundAnalysisData(postObject, false)
   .then((response) => {
     console.log(response)
     thisInstance.setState({
       saved: true,
       isPublished: true
     })
   })
  }

  componentWillReceiveProps(newProps){
    this.setState({
        values: newProps.values
    })
  }

  render () {
    const routerStore = this.props.routerStore
    const values = this.state.values
    //console.log("routerStore", routerStore)
    //console.log( "preview props", this.props)
    if(routerStore.analysisData === undefined)
      return (<div></div>)
    else
      return (
        <div key='kursutveckling-andmin-preview' className='container' id='preview-container' >
          {routerStore.analysisData.examinationRounds && routerStore.analysisData.examinationRounds.length === 0 
          ?<Alert>Fel fel fel !</Alert>
          :<div>
          <Row key='preview' id='preview-container'>
            <Col sm='3' className='col-temp'>
              <h4>ID </h4>
              <p id='_id' key='id' >{values._id}</p>
              <h4>course code </h4>
              <p id='courseCode' key='courseCode'>{values.courseCode}</p>
              <h4>round name </h4>
              <p id='analysisName' key='round' >{values.analysisName}</p>
            </Col>
            <Col sm='3' className='col-temp'>
              <h4>targetGroup </h4>
              <p id='programmeCodes' key='programmeCodes' >{values.programmeCodes} </p>
              <h4>examiners </h4>
              <p id='examiners' key='examiners' >{values.examiners}</p>
              <h4>responsibles </h4>
              <p id='responsibles' key='responsibles' >{values.responsibles}</p>
            </Col>
            <Col sm='3' className='col-temp' >
              <h4>examinationRounds </h4>
              <p id='examinationRounds' key='examinationRounds' >{values.examinationRounds.toString()}</p>
              <h4>registered students </h4>
              <p id='registeredStudents' key='registeredStudents' >{values.registeredStudents}</p>
              <h4>examination grade </h4>
              <p id='examinationGrade' key='examinationGrade' >{values.examinationGrade} %</p>
            </Col>
            <Col sm='3' className='col-temp'>
              <h4>alteration text </h4>
              <p id='alterationText' key='alterationText' >{values.alterationText}</p>
              <h4>commentChange </h4>
              <p id='commentChange' key='commentChange' >{values.commentChange}</p>
              <h4>commentExam </h4>
              <p id='commentExam' key='commentExam' dangerouslySetInnerHTML={{__html: values.commentExam}}/>
            </Col>
          </Row>
          <br />
        <p>--------------------------------------------------------------------------------------------------------------------------</p>
     </div>    
          }
     </div>   
    )
  }
}

export default Preview
