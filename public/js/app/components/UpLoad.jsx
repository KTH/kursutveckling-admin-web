import React from 'react'
import loader from '../../../img/*.gif'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  display: 'flex',
};

class UpLoad extends React.Component {
  constructor() {
    super()
    this.onChange = this.onChange.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.state = {
      files: [],
    }
  }

  onChange(event) {
    this.props.handleUpload(event.target.id, event.target.files, event)
  }
  
  removeFile(event) {
       this.props.handleRemoveFile(event)
  }

  render() {
    const {id, path, progress, file, notValid} = this.props
    return (
      <div className={notValid.indexOf('analysisFile') > -1 ? 'not-valid' : ''}>
       { file && file.length > 0
        ? <span>
          <br/>
          <div className='inline-flex'>
            <p className='upload-text'> {file} </p>
            <div className="iconContainer icon-trash-can" id={'remove_'+id} onClick={this.removeFile}></div>
          </div>
        </span>
        : <label className="custom-file-upload">
          <input type="file" id={id} onChange={this.onChange} />
          {progress > 0 
            ? <span>
              <img title = 'loading file' src={path + '/static/'+ loader['ajax-loader']}/>
              </span>
            : ''
          }
        </label>
       }
      </div>
    )
  }
}

export default UpLoad
