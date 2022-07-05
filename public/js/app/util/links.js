const goToStartPage = returnToUrl => {
  window.location = returnToUrl
}

const courseAdminLink = (courseCode, language) => {
  const languageParameter = language === 'en' ? '?l=en' : ''
  return `/kursinfoadmin/kurser/kurs/${courseCode}${languageParameter}`
}

function replaceSiteUrl(courseCode, language) {
  const siteNameElement = document.querySelector('.block.siteName a')
  if (siteNameElement) {
    siteNameElement.href = courseAdminLink(courseCode, language)
  }
}

export { courseAdminLink, goToStartPage, replaceSiteUrl }
