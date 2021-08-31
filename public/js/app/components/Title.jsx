import React, { Component } from 'react'
import i18n from '../../../../i18n/index'
import PropTypes from 'prop-types'
import { PageHeading } from '@kth/kth-reactstrap/dist/components/studinfo'

function Title({ courseCode, header, title, language: langIndex }) {
  if (title && title.credits) {
    title.credits = title.length > 0 && title.credits.toString().indexOf('.') < 0 ? title.credits + '.0' : title.credits
  }
  const courseTitle = title
    ? `${title.name} ${langIndex === 0 ? title.credits : title.credits.toString().replace('.', ',')} ${
        langIndex === 0 ? 'credits' : 'hp'
      }`
    : ''
  return <PageHeading subHeading={`${courseCode} ${courseTitle}`}>{header}</PageHeading>
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
