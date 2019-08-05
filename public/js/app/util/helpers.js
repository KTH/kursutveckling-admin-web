'use strict'
import '@babel/polyfill'

const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska' || language === 1) {
    return date
  }
  const splitDate = date.split('-')
  return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
}

const getTodayDate = (date = '') => {
  let today = date.length > 0 ? new Date(date) : new Date()
  let dd = String(today.getDate()).padStart(2, '0')
  let mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  let yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

const getLanguageToUse = (list, defaultLanguage) => {
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

const formatDate = (date, lang) => {
  let thisDate = getTodayDate(date)
  return getDateFormat(thisDate, lang)
}

const noAccessToRoundsList = (memberOf, rounds, courseCode, semester) => {
  let roundIds = []
  if (memberOf.toString().indexOf(courseCode + '.examiner') > 0) { return roundIds }
  roundIds = rounds.filter(round => {
    if (memberOf.toString().indexOf(`${courseCode}.${semester}.${round.roundId}.courseresponsible`) < 0) { return round.roundId }
  })
  return roundIds
}

const getAccess = (memberOf, round, courseCode, semester) => {
  if (memberOf.toString().indexOf(courseCode.toUpperCase() + '.examiner') > -1) {
    return true
  }

  if (memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`) > -1) {
    return true
  }

  return false
}

export { getAccess, noAccessToRoundsList, formatDate, getLanguageToUse, getTodayDate, getDateFormat }
