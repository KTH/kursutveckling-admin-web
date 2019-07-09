
import React from 'react';
import { Progress, Row, Col } from 'reactstrap'
import i18n from '../../../../i18n/index'

const ProgressBar = (props) => {
  const {language, active} = props
  return (
    <div>
      <Row className = 'test'>
        <Col className = {`col-md-4 col-sm-12 progress-bar1 ${active === 1 ? 'progress-active' : ''}` }>
          {i18n.messages[language].messages.header_progress_select}
        </Col>
        <Col className = {`col-md-4 col-sm-12 progress-bar1 ${active === 2 ? 'progress-active' : ''}` }>
        {i18n.messages[language].messages.header_progress_edit_upload}
        </Col>
        <Col className = {`col-md-4 col-sm-12 progress-bar1 ${active === 3 ? 'progress-active' : ''}` }>
        {i18n.messages[language].messages.header_progress_review}
        </Col>
      </Row>
     
      {/*<Progress multi>
        <Progress bar color='' value="33.3">Meh</Progress>
        <Progress bar value="33.3">Wow!</Progress>
        <Progress bar color='success'  value="33.3">Cool</Progress>
      </Progress>*/}
    </div>
  );
};

export default ProgressBar;