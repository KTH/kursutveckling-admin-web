'use strict'
export const getDateFormat = (date, language = 1) => {
  if (language === 'svenska' || language === 'Swedish') {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
}
