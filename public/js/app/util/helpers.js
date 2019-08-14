'use strict'
import '@babel/polyfill'

const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska' || language === 1 || language === 'sv') {
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

const getLanguageToUse = (roundList, roundIdlist, defaultLanguage) => {
  if (roundIdlist.length === 1) {
    for (let round = 0; round < roundList.length; round++) {
      if (roundList[round].roundId === roundIdlist.toString()) {
        return roundList[round].language
      }
    }
  }

  let tempLang = roundIdlist[0].language
  for (let id = 0; id < roundIdlist.length; id++) {
    for (let round = 0; round < roundList.length; round++) {
      if (roundList[round].roundId === roundIdlist[id] && tempLang !== roundList[round].language) {
        return defaultLanguage
      }
    }
  }
  return tempLang === defaultLanguage ? defaultLanguage : 'Svenska'
}

const formatDate = (date, lang) => {
  let thisDate = getTodayDate(date)
  return getDateFormat(thisDate, lang)
}

const isValidDate = (date) => {
  let dateFormat = /^\d{4}-\d{2}-\d{2}$/
  let regex = new RegExp(dateFormat)
  return regex.test(date)
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
  if (memberOf.toString().indexOf(courseCode.toUpperCase() + '.examiner') > -1 || memberOf.toString().indexOf('.kursinfo-admins') > -1) {
    return true
  }

  if (memberOf.toString().indexOf(`${courseCode.toUpperCase()}.${semester}.${round.ladokRoundId}.courseresponsible`) > -1) {
    return true
  }

  return false
}

const getValueFromObjectList = (objectList, value, key, returnKey) => {
  let object
  for (let index = 0; index < objectList.length; index++) {
    object = objectList[index]
    if (object[key] === value) {
      return object[returnKey]
    }
  }
  return null
}

export {
  getAccess,
  noAccessToRoundsList,
  formatDate,
  getLanguageToUse,
  getTodayDate,
  getDateFormat,
  getValueFromObjectList,
  isValidDate
}
