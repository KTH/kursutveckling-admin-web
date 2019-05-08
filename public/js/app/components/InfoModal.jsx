import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

//Custom components
import CopyText from './CopyText'

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
            <ModalHeader toggle={this.props.toggle}>{this.props.infoText.header}</ModalHeader>
            <ModalBody>
              <p dangerouslySetInnerHTML={{ __html:this.props.infoText.body}}/>
             {/* <CopyText textToCopy={'tjohoooooooooooooo'} />*/}
            </ModalBody>
            <ModalFooter>
              <Button id={this.props.type} color='secondary' onClick={this.props.toggle}>{this.props.infoText.btnCancel}</Button>
              <Button color='secondary' onClick={this.handleConfirm}>{this.props.infoText.btnConfirm}</Button>
            </ModalFooter>
          </Modal>
          </div>
      )
    }
  }

export default InfoModal
