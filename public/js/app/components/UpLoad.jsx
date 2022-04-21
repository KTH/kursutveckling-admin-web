import React from 'react'
import { Spinner } from 'reactstrap'

function UpLoad(props) {
  function onChange(event) {
    props.handleUpload(event.target.id, event.target.files, event)
  }

  function removeFile(event) {
    props.handleRemoveFile(event)
  }

  const { id, progress, file, notValid, type, translate } = props
  const { mandatoryFields, wrongFileTypeFields } = notValid

  return (
    <div className={mandatoryFields.includes(type) || wrongFileTypeFields.includes(type) ? 'not-valid' : ''}>
      {file && file.length > 0 ? (
        <span>
          <br />
          <div className="inline-flex">
            <p className="upload-text"> {file} </p>
            <div className="iconContainer icon-trash-can" id={'remove_' + id} onClick={removeFile} />
          </div>
        </span>
      ) : (
        <label className="custom-file-upload">
          <input type="file" id={id} onChange={onChange} />
          {progress > 0 && (
            <>
              <Spinner color="primary" size="sm">
                {translate.spinner_loading_file}
              </Spinner>{' '}
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
