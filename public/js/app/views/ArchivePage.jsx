import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col } from 'reactstrap'

//Components

//Helpers 
import i18n from '../../../../i18n/index'

@inject(['archiveStore'])
@observer
class ArchivePage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { archiveStore } = this.props
    const translate = i18n.messages[archiveStore.language].messages
    return (
      <Container>
        <Row>
          <Col>
            <h1>Archive</h1>
          </Col>
        </Row>
        <Row>
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Round</th>
                <th>Published Date</th>
                <th>Exported</th>
              </tr>
            </thead>
            <tbody>
            {
              archiveStore.archiveFragments.map(archiveFragment => (
                <tr key={archiveFragment.courseCode + '-' + archiveFragment.courseRound}>
                  <td>{archiveFragment.courseCode}</td>
                  <td>{archiveFragment.courseRound}</td>
                  <td>{archiveFragment.attachments[0] ? archiveFragment.attachments[0].publishedDate : null}</td>
                  <td>{`${archiveFragment.exported}`}</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </Row>
      </Container>
    )
  }
}

export default ArchivePage
