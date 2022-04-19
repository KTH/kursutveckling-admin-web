import React, { useState } from 'react'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap'
import i18n from '../../../../../i18n/index'

const OnlyMobileVisiblePopup = ({ ariaLabel, ariaPressed, popUpHeader, id, onClick }) => {
  const mobilePopoverId = 'mobile-table-header' + popUpHeader + id
  return (
    <span
      className="mobile-header-popovers"
      key={'onlyForMobileView' + popUpHeader + id}
      role="info icon button"
      aria-labelledby={mobilePopoverId}
    >
      <label id={mobilePopoverId} className="d-none d-sm-block d-md-nonee">
        {popUpHeader}
      </label>{' '}
      <Button
        id={id}
        type="button"
        className="mobile btn-info-modal"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        style={{ minHeight: '0.75rem' }}
      >
        <span className="sr-only">{ariaLabel}</span>
      </Button>
    </span>
  )
}
function ControlledPopover(props) {
  const [state, setState] = useState({ popoverOpen: false })

  function  toggle() {
    setState({ popoverOpen: !state.popoverOpen })
  }
  const { cellId, describesId, header, popoverText, popType } = props
  const { popoverOpen } = state
  const triggerId = `${popType}-popover-${cellId}`
  const dialogHeaderId = `${popType}-dialog-header-${cellId}`
  const dialogBodyId = `${popType}-dialog-header-${cellId}`
  const tableLang = i18n.isSwedish() ? 1 : 0
  const { header_more_information: ariaLabel, aria_label_close_icon: closeAria } = i18n.messages[tableLang].messages

  return (
    <span role="dialog" aria-labelledby={dialogHeaderId} aria-describedby={dialogBodyId}>
      {(popType === 'mobile' && (
        <OnlyMobileVisiblePopup
          popUpHeader={header}
          id={triggerId}
          onClick={toggle}
          ariaLabel={ariaLabel}
          ariaPressed={popoverOpen}
        />
      )) || (
        <Button
          id={triggerId}
          type="button"
          className="desktop btn-info-modal"
          onClick={toggle}
          aria-label={ariaLabel}
          aria-pressed={popoverOpen}
          style={{ minHeight: '0.75rem' }}
        >
          <span className="sr-only">{ariaLabel}</span>
        </Button>
      )}
      <Popover
        isOpen={popoverOpen}
        placement={popType === 'mobile' ? 'left' : 'top'}
        target={triggerId}
        key={triggerId}
      >
        <PopoverHeader id={dialogHeaderId}>
          {header}{' '}
          <Button className="close" onClick={toggle} aria-label={closeAria}>
            &times;
          </Button>
        </PopoverHeader>
        <PopoverBody id={dialogBodyId}>{popoverText}</PopoverBody>
      </Popover>
    </span>
  )
}

export default ControlledPopover
