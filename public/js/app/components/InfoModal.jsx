import React from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import Button from '../components-shared/Button'

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
      {type === 'info' && <Button id={type} type="button" onClick={toggle} />}
      <Modal isOpen={isOpen} toggle={toggle} className={className} fade={fadeModal} id={id}>
        <div className="modal-header">
          <h4 className="modal-title">{infoText.header}</h4>
          <button
            type="button"
            className="kth-icon-button close"
            aria-label={infoText.btnCancel}
            onClick={ev => toggle(ev, type)}
          />
        </div>
        <ModalBody>
          {type === 'copy' ? (
            <CopyText textToCopy={url} header={copyHeader} />
          ) : (
            <p dangerouslySetInnerHTML={{ __html: infoText.body }} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button id={type} variant="secondary" onClick={toggle}>
            {infoText.btnCancel}
          </Button>
          {infoText.btnConfirm && (
            <Button variant="secondary" onClick={handleConfirm}>
              {infoText.btnConfirm}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default InfoModal
