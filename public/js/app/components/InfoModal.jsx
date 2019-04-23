import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'



class InfoModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
        modal: this.props.isOpen
      }
    this.handleConfirm = this.handleConfirm.bind(this)
  }
  
  handleConfirm(event){
    event.preventDefault()
    this.props.handleConfirm(this.props.id, true)
  }

  render () {
      const fadeModal = (this.props.hasOwnProperty('fade') ? this.props.fade : true)
      return (
        <div>
          <Modal isOpen = {this.props.isOpen} toggle={this.props.toggle} className={this.props.className} fade={fadeModal}>
            <ModalHeader toggle={this.props.toggle}>Info</ModalHeader>
            <ModalBody>
              <p>{this.props.infoText}</p>
            </ModalBody>
            <ModalFooter>
              <Button color='success' onClick={this.handleConfirm}>Confirm</Button>
              <Button color='secondary' onClick={this.props.toggle}>Close</Button>
            </ModalFooter>
          </Modal>
          </div>
      )
    }
  }

export default InfoModal
