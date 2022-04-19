import React from 'react'
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap'
import i18n from '../../../../i18n/index'

function CopyText(props) {
  
  function handleCopy(event) {
    var textField = document.createElement('textarea')
    textField.innerText = props.textToCopy
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  return (
    <div>
      <h4> {props.header} </h4>
      <InputGroup>
        <Input type="text" value={props.textToCopy} readOnly={true} />
        <InputGroupText addonType="append">
          <Button color="secondary" className="copy-btn" onClick={handleCopy}>
            {i18n.isSwedish() ? 'Kopiera' : 'Copy'}
            {/* <span className="icon-copy"></span> */}
          </Button>
        </InputGroupText>
      </InputGroup>
    </div>
  )
}

export default CopyText
