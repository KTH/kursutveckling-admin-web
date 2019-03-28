/* import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/Modal/ModalBody'
import ModalHeader from 'react-bootstrap/Modal/ModalHeader'
import ModalFooter from 'react-bootstrap/Modal/ModalFooter'
import Button from 'react-bootstrap/Button'


class InfoModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
        modal: false
      }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
      this.setState({
        modal: !this.state.modal
      })
    }
  render () {
      const fadeModal = (this.props.hasOwnProperty('fade') ? this.props.fade : true)
      return (
        <Button className ='btn-info-modal' onClick={this.toggle}>{this.props.buttonLabel}
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} fade={fadeModal}>
            <ModalHeader toggle={this.toggle}>Info</ModalHeader>
            <ModalBody>
              <p>{this.props.infoText}</p>
            </ModalBody>
            <ModalFooter>
              <Button color='secondary' onClick={this.toggle}>Close</Button>
            </ModalFooter>
          </Modal>
        </Button>
      )
    }
  }

export default InfoModal*/
