import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Input } from 'reactstrap'

//Custom components
import CopyText from './CopyText'

class InfoModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
        modal: this.props.isOpen,
        newEndDate: ''
      }
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
  }
  
  handleConfirm(event){
    event.preventDefault()
    const { type, handleConfirm } = this.props
    handleConfirm(this.props.id, true)
  }
  
  handleDateChange(event){
    event.persist()
    this.state.newEndDate = event.target.value
  }


  render () {
    const { fade, isOpen, toggle, className, type, infoText, id, url, copyHeader } = this.props
    const fadeModal = (this.props.hasOwnProperty('fade') ? fade : true)

      return (
        <div>
          {type === 'info'
            ? <Button id={type} type="button"  onClick={toggle} className='btn-info-modal btn btn-secondary info-inline'/>
            : ''
          }
          <Modal isOpen = {isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
            <ModalHeader toggle={toggle}>{infoText.header}</ModalHeader>
            <ModalBody>
              {type=== 'copy'
                ? <CopyText textToCopy={url} header = {copyHeader} />
                : <p dangerouslySetInnerHTML={{ __html:infoText.body}}/>
              }
            </ModalBody>
            <ModalFooter>
              <Button id={type} color='secondary' onClick={toggle}>{infoText.btnCancel}</Button>
              {
                infoText.btnConfirm
                ?<Button color='secondary' onClick={this.handleConfirm}>{infoText.btnConfirm}</Button>
                : ''
              }
            </ModalFooter>
          </Modal>
          </div>
      )
    }
  }

  

export default InfoModal
