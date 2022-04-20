import React, { useReducer } from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

// Custom components
import CopyText from './CopyText'

const paramsReducer = (state, action) => ({ ...state, ...action })

function InfoModal(props) {
  const { fade, isOpen, toggle, className, type, infoText, id, url, copyHeader } = props

  function handleConfirm(event) {
    event.preventDefault()
    props.handleConfirm(props.id, true)
  }

  function handleDateChange(event) {
    event.persist()
    props.handleDateChange(event.target.value)
  }

  const fadeModal = props.hasOwnProperty('fade') ? fade : true

  return (
    <div>
      {type === 'info' && (
        <Button id={type} type="button" onClick={toggle} className="btn-info-modal btn btn-secondary" />
      )}
      <Modal isOpen={isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
        <ModalHeader toggle={toggle}>{infoText.header}</ModalHeader>
        <ModalBody>
          {type === 'copy' ? (
            <CopyText textToCopy={url} header={copyHeader} />
          ) : (
            <p dangerouslySetInnerHTML={{ __html: infoText.body }} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button id={type} color="secondary" onClick={toggle}>
            {infoText.btnCancel}
          </Button>
          {infoText.btnConfirm && (
            <Button color="secondary" onClick={handleConfirm}>
              {infoText.btnConfirm}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default InfoModal
