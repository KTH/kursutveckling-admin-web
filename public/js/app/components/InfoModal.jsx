import React from 'react'
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap'

// Custom components
import CopyText from './CopyText'

function InfoModal(props) {
  const {
    fade,
    isOpen,
    toggle,
    className,
    type,
    infoText,
    id,
    url,
    copyHeader,
    handleConfirm: handleConfirmFromProps,
  } = props

  function handleConfirm(event) {
    event.preventDefault()
    handleConfirmFromProps(id, true)
  }

  const fadeModal = fade ?? true

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
