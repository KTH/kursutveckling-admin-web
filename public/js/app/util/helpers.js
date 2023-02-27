'use strict'

const formatToLocaleDate = date => {
  if (date === '') return null
  const timestamp = Date.parse(date)
  const parsedDate = new Date(timestamp)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  const languageTag = 'en-GB'

  return parsedDate.toLocaleDateString(languageTag, options)
}

const getDateFormat = (date, language) => {
  if (language === 'Svenska' || language === 'Engelska' || language === 'sv' || language === 1 || language === 'sv') {
    return date
  }

  return formatToLocaleDate(date)
}

const getTodayDate = (date = '') => {
  const today = date.length > 0 ? new Date(date) : new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0') // January is 0!
  const yyyy = today.getFullYear()

  return yyyy + '-' + mm + '-' + dd
}

const getLanguageToUse = (roundList, roundIdlist, defaultLanguage) => {
  if (roundIdlist.length === 1) {
    for (let round = 0; round < roundList.length; round++) {
      if (roundList[round].applicationCode === roundIdlist.toString()) {
        return roundList[round].language
      }
    }
  }

  const tempLang = roundList[0].language
  for (let id = 0; id < roundIdlist.length; id++) {
    for (let round = 0; round < roundList.length; round++) {
      if (roundList[round].applicationCode === roundIdlist[id] && tempLang !== roundList[round].language) {
        return defaultLanguage
      }
    }
  }
  return tempLang === defaultLanguage ? defaultLanguage : 'Svenska'
}

const formatISODate = (date, lang) => {
  if (date === '') return null
  const timestamp = Date.parse(date)
  const parsedDate = new Date(timestamp)
  let languageTag // BCP 47 language tag
  switch (lang) {
    case 'Svenska':
    case 'Engelska':
    case 1:
    case 'sv':
      languageTag = 'sv-SE'
      break
    default:
      languageTag = 'en-US'
      break
  }
  return parsedDate.toLocaleDateString(languageTag)
}

const isValidDate = date => {
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/
  const regex = new RegExp(dateFormat)
  return regex.test(date)
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

export { formatISODate, getLanguageToUse, getTodayDate, getDateFormat, getValueFromObjectList, isValidDate }
