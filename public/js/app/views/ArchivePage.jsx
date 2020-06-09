import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Button } from 'reactstrap'

//Components

//Helpers 
import i18n from '../../../../i18n/index'

@inject(['archiveStore'])
@observer
class ArchivePage extends Component {

  toggleSelected = id => {
    this.props.archiveStore.toggleSelectedArchiveFragment(id)
  }

  downloadArchivePackage = () => {
    this.props.archiveStore.downloadArchivePackage(this.props.archiveStore.selectedArchiveFragments)
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
                <th>Include</th>
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
                  <td><input type="checkbox" onChange={() => this.toggleSelected(archiveFragment._id)} checked={archiveStore.isSelectedArchiveFragment(archiveFragment._id)}/></td>
                  <td>{archiveFragment.courseCode}</td>
                  <td>{archiveFragment.courseRound}</td>
                  <td>{archiveFragment.attachments[0] ? archiveFragment.attachments[0].publishedDate : null}</td>
                  <td>{`${!!archiveFragment.exported}`}</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </Row>
        <Row className="py-4">
          <Col>
          <Button disabled={archiveStore.selectedArchiveFragments.length === 0} onClick={this.downloadArchivePackage}>Create Archive Package</Button>
        </Col>
        </Row>
      </Container>
    )
  }
}

export default ArchivePage
