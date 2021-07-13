import React, { Component } from 'react'
import { ProgressBar } from '@kth/kth-reactstrap/dist/components/utbildningsinfo'
import i18n from '../../../../i18n/index'
import PropTypes from 'prop-types'

class Title extends Component {
  render() {
    const { courseCode, header, title, language: langIndex, progress, showProgressBar } = this.props

    if (title && title.credits) {
      title.credits =
        title.length > 0 && title.credits.toString().indexOf('.') < 0 ? title.credits + '.0' : title.credits
    }
    return (
      <div key="course-title" id="course-title">
        <h1>{header}</h1>
        <h4>
          <span>{courseCode}&nbsp;</span>
          {title ? (
            <span content={title.credits} datatype="xsd:decimal" property="teach:ects">
              {title.name}&nbsp;
              {langIndex === 0 ? title.credits : title.credits.toString().replace('.', ',')}&nbsp;
              {langIndex === 0 ? 'credits' : 'hp'}
            </span>
          ) : (
            ''
          )}
        </h4>
        {showProgressBar && (
          <ProgressBar active={progress} pages={i18n.messages[langIndex].messages.pagesProgressBar} />
        )}
        {/* <ProgressBar language={language} active={progress} /> */}
      </div>
    )
  }
}

Title.propTypes = {
  courseCode: PropTypes.string.isRequired,
  language: PropTypes.oneOf([0, 1]).isRequired,
  title: PropTypes.oneOf([
    '',
    PropTypes.string,
    PropTypes.shape({ credits: PropTypes.oneOf([PropTypes.string, PropTypes.number]), name: PropTypes.string }),
  ]),
  progress: PropTypes.number.isRequired,
  showProgressBar: PropTypes.bool.isRequired,
}

export default Title
