'use strict'
export const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska') {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
}

export const getLanguageToUse = (list, defaultLanguage) => {
  if (list.length === 1) {
    return list[0].language
  }

  let tempLang = list[0].language
  for (let index = 1; index < list.length; index++) {
    if (tempLang !== list[index].language) {
      return defaultLanguage
    }
  }
  return tempLang === defaultLanguage ? defaultLanguage : 'Svenska'
}

export const formatDate = (date, lang) => {
  let Newdate = new Date()
}
