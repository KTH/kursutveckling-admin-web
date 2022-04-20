import React, { useState } from 'react'
import { Spinner } from 'reactstrap'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  display: 'flex',
}

function UpLoad(props) {
  const [ files, setFiles ] = useState([])

  function onChange(event) {
    props.handleUpload(event.target.id, event.target.files, event)
  }

  function removeFile(event) {
    props.handleRemoveFile(event)
  }

  const { id, path, progress, file, notValid, type } = props
  const { mandatoryFields, wrongFileTypeFields } = notValid

  return (
    <div className={mandatoryFields.includes(type) || wrongFileTypeFields.includes(type) ? 'not-valid' : ''}>
      {file && file.length > 0 ? (
        <span>
          <br />
          <div className="inline-flex">
            <p className="upload-text"> {file} </p>
            <div className="iconContainer icon-trash-can" id={'remove_' + id} onClick={removeFile}></div>
          </div>
        </span>
      ) : (
        <label className="custom-file-upload">
          <input type="file" id={id} onChange={onChange} />
          {progress > 0 && (
            <>
              <Spinner size="sm" color="primary" />
              <div className="file-progress-bar">
                <div className="file-progress" style={{ width: progress + '%' }}></div>
              </div>
            </>
          )}
        </label>
      )}
    </div>
  )
}
export default UpLoad
