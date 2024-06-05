import React from 'react'
import { Spinner } from 'reactstrap'

function UpLoad(props) {
  const { handleUpload, handleRemoveFile } = props
  function onChange(event) {
    handleUpload(event.target.id, event.target.files, event)
  }

  function removeFile(event) {
    handleRemoveFile(event)
  }

  const { id, progress, file, notValid, type, translate } = props
  const { mandatoryFields, wrongFileTypeFields } = notValid

  return (
    <div className={mandatoryFields.includes(type) || wrongFileTypeFields.includes(type) ? 'not-valid' : ''}>
      {file && file.length > 0 ? (
        <div className="upload-text-wrapper">
          <p className="upload-text"> {file} </p>
          <button className="kth-icon-button icon-trash-can" type="button" id={`remove_${id}`} onClick={removeFile} />
        </div>
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
