import React from 'react'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'

const InfoButton = ({ id, textObj }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <>
      <button id={`button-to-activate-popup-${id}`} type="button" className="btn-info-modal" onClick={toggle} />
      <Popover
        isOpen={isOpen}
        trigger="legacy"
        placement="auto"
        toggle={toggle}
        target={`button-to-activate-popup-${id}`}
      >
        <PopoverHeader>
          <span>{textObj.header}</span>
          <button className="kth-icon-button close" onClick={toggle} aria-label="Close" />
        </PopoverHeader>

        <PopoverBody>
          <p>{textObj.body}</p>
        </PopoverBody>
      </Popover>
    </>
  )
}

export default InfoButton
