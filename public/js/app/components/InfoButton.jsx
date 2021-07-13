import React, { Component } from 'react'
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj, addClass }) => {
  return (
    <div className={addClass ? addClass : ''}>
      <Button
        id={id}
        type="button"
        className="btn-info-modal btn btn-secondary"
        style={{ height: '1.3em', width: '1.3em' }}
      />
      <UncontrolledPopover trigger="legacy" placement="auto" target={id}>
        <PopoverHeader>{textObj.header}</PopoverHeader>
        <PopoverBody>
          <p>{textObj.body}</p>
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  )
}

export default InfoButton
