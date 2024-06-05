import React from 'react'
import PropTypes from 'prop-types'
import PageHeading from '../components-shared/PageHeading'

function Title({ courseCode, header, title, language: langIndex }) {
  if (title && title.credits) {
    title.credits = title.length > 0 && title.credits.toString().indexOf('.') < 0 ? title.credits + '.0' : title.credits
  }
  const courseTitle = title
    ? `${title.name} ${langIndex === 0 ? title.credits : title.credits.toString().replace('.', ',')} ${
        langIndex === 0 ? 'credits' : 'hp'
      }`
    : ''
  return <PageHeading heading={header} subHeading={`${courseCode} ${courseTitle}`} />
}

Title.propTypes = {
  courseCode: PropTypes.string.isRequired,
  language: PropTypes.oneOf([0, 1]).isRequired,
  title: PropTypes.oneOf([
    '',
    PropTypes.string,
    PropTypes.shape({ credits: PropTypes.oneOf([PropTypes.string, PropTypes.number]), name: PropTypes.string }),
  ]),
}

export default Title
