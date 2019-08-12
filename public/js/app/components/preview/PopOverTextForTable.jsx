import React from 'react'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

export const PopoverExamItem = ({examShortAndLongStrArr, id}) => {
  return (
    <UncontrolledPopover trigger='hover' placement='left-start' target={id} key={id}>
      <PopoverBody>
        {examShortAndLongStrArr.map((shortAndLongTextStr, index) => <p className='popOver' key={index}>{shortAndLongTextStr[1]}</p>)}
      </PopoverBody>
    </UncontrolledPopover>
  )
}

export const PopOverTextForTableHeaders = ({translate, columnsArr, popOverId}) => {
  return columnsArr.map((apiColName, index) =>
    <span key = {index+apiColName}>
      <UncontrolledPopover trigger='legacy' placement='auto' target={popOverId + apiColName} key={popOverId+index} className='header-popup'>
        <PopoverHeader>{translate[apiColName].header}</PopoverHeader>
        <PopoverBody>
          {translate[apiColName].popoverText}
        </PopoverBody>
      </UncontrolledPopover>
      <UncontrolledPopover trigger='legacy' placement='auto' target={'labelfor' + popOverId + apiColName} key={index + popOverId} className='header-popup'>
        <PopoverHeader>{translate[apiColName].header}</PopoverHeader>
        <PopoverBody>
          {translate[apiColName].popoverText}
        </PopoverBody>
      </UncontrolledPopover>
    </span>
    )
}