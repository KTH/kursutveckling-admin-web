const SUPERUSER_PART = 'kursinfo-admins'
const SEMESTER = [
  {
    1: 'Spring ',
    2: 'Autumn ',
  },
  {
    1: 'VT ',
    2: 'HT ',
  }
]
const EMPTY = ['No information added', 'Ingen information tillagd']
const ADMIN_URL = '/kursinfoadmin/kurser/kurs/'
const KURSUTVECKLING_URL = '/kursutveckling/'
const SERVICE_URL = {
  admin: '/kursinfoadmin/kurser/kurs/',
  // kutv: '/kursutveckling/',
}
const BREADCRUMB_URL = '/student/kurser/kurser-inom-program'
const SYLLABUS_URL = '/student/kurser/kurs/kursplan/'

const LANGUAGE = {
  sv: {
    svenska: 'svenska',
  },
}

const ADMIN_KURSUTVECKLING = '/kursinfoadmin/kursutveckling/'

module.exports = { 
  SUPERUSER_PART,
  SEMESTER, EMPTY,
  ADMIN_URL,
  KURSUTVECKLING_URL,
  SERVICE_URL,
  BREADCRUMB_URL,
  SYLLABUS_URL,
  LANGUAGE,
  ADMIN_KURSUTVECKLING
}
