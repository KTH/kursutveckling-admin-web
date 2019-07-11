
import React from 'react';
import { Progress, Row, Col } from 'reactstrap'
import i18n from '../../../../i18n/index'

const ProgressBar = (props) => {
  const {language, active} = props
  return (
      <Row className = 'progress-bar-container'>
        <div className = {`col-md-4 col-sm-12 progress-bar1 ${active === 1 ? 'progress-active' : ''}` }>
          <h4>{i18n.messages[language].messages.header_progress_select}</h4>
        </div>
        <div className = {`col-md-4 col-sm-12 progress-bar1 ${active === 2 ? 'progress-active' : ''}` }>
        <h4>{i18n.messages[language].messages.header_progress_edit_upload}</h4>
        </div>
        <div className = {`col-md-4 col-sm-12 progress-bar1 ${active === 3 ? 'progress-active' : ''}` }>
        <h4>{i18n.messages[language].messages.header_progress_review}</h4>
        </div>
      </Row>
  )
}

export default ProgressBar;