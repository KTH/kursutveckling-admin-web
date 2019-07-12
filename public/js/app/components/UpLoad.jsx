import React from 'react'
import { render } from 'react-dom'
import { Spinner } from 'reactstrap'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  display: 'flex',
};

class UpLoad extends React.Component {
  constructor() {
    super()
    this.onChange = this.onChange.bind(this);
    this.state = {
      files: [],
    }
  }

  onChange(e) {
    var files = e.target.files
    console.log(files)
    var filesArr = Array.prototype.slice.call(files)
    console.log(filesArr)
    this.setState({ files: [...this.state.files, ...filesArr] })
    this.props.handleUpload(e.target.id, e.target.files, e)
  }
  
  removeFile(f) {
       this.setState({ files: this.state.files.filter(x => x !== f) })
  }

  render() {
    return (
      <div>
        <label className="custom-file-upload">
          <input type="file" id={this.props.id} onChange={this.onChange} />
          <i className="fa fa-cloud-upload" /> 
       
        </label>
        <Spinner color='primary' style={{ width: '3rem', height: '3rem' }} visible={true}/>{' '}
      </div>
    )
  }
}

export default UpLoad
