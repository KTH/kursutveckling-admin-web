import React, { Component } from 'react';
import { Button, UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'


const InfoButton =({ id, textObj }) => {
    return (
      <div>
        <Button id={id} type="button" className='btn-info-modal btn btn-secondary info-inline'/>
        <UncontrolledPopover trigger="legacy" placement="auto"  target={id} >
          <PopoverHeader>{textObj.header}</PopoverHeader>
          <PopoverBody><p>{textObj.body}</p></PopoverBody>
        </UncontrolledPopover>
      </div>
    )
  }

export default InfoButton