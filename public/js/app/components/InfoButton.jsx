import React from 'react'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj }) => (
  <>
    <button id={`button-to-activate-popup-${id}`} type="button" className="btn-info-modal" />
    <UncontrolledPopover trigger="legacy" placement="auto" target={`button-to-activate-popup-${id}`}>
      <PopoverHeader>{textObj.header}</PopoverHeader>
      <PopoverBody>
        <p>{textObj.body}</p>
      </PopoverBody>
    </UncontrolledPopover>
  </>
)

export default InfoButton
