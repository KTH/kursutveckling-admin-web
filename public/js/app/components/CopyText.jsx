import React from 'react'
import { Input, InputGroup } from 'reactstrap'
import Button from '../components-shared/Button'
import i18n from '../../../../i18n/index'

function CopyText({ header, webContext = {}, textToCopy = '' }) {
  const { analysisId, browserConfig, courseTitle } = webContext
  const textToCopyInput =
    textToCopy ||
    browserConfig.hostUrl +
      browserConfig.proxyPrefixPath.uri +
      '/preview/' +
      analysisId +
      '?title=' +
      encodeURI(courseTitle.name + '_' + courseTitle.credits)

  function handleCopy() {
    const textField = document.createElement('textarea')
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
        <Button variant="secondary" className="copy-btn" onClick={handleCopy}>
          {i18n.isSwedish() ? 'Kopiera' : 'Copy'}
        </Button>
      </InputGroup>
    </div>
  )
}

export default CopyText
