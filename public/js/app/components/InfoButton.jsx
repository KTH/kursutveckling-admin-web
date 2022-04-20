import React from 'react'
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj, addClass }) => (
  <div className={addClass || ''}>
    <Button
      id={`button-to-activate-popup-${id}`}
      type="button"
      className="btn-info-modal btn btn-secondary"
      style={{ height: '1.3em', width: '1.3em' }}
    />
    <UncontrolledPopover trigger="legacy" placement="auto" target={`button-to-activate-popup-${id}`}>
      <PopoverHeader>{textObj.header}</PopoverHeader>
      <PopoverBody>
        <p>{textObj.body}</p>
      </PopoverBody>
    </UncontrolledPopover>
  </div>
)

export default InfoButton
