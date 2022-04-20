import React from 'react'
import { Input, InputGroup, Button } from 'reactstrap'
import i18n from '../../../../i18n/index'

function CopyText({ header, webContext, textToCopy = '' }) {
  const { analysisId, browserConfig, courseTitle } = webContext
  const textToCopyInput =
    textToCopy ||
    browserConfig.hostUrl +
      browserConfig.proxyPrefixPath.uri +
      '/preview/' +
      analysisId +
      '?title=' +
      encodeURI(courseTitle.name + '_' + courseTitle.credits)

  function handleCopy(event) {
    var textField = document.createElement('textarea')
    textField.innerText = textToCopyInput
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  return (
    <div>
      <h4> {header} </h4>
      <InputGroup>
        <Input type="text" value={textToCopyInput} readOnly={true} />
        <Button color="secondary" className="copy-btn" onClick={handleCopy}>
          {i18n.isSwedish() ? 'Kopiera' : 'Copy'}
        </Button>
      </InputGroup>
    </div>
  )
}

export default CopyText
