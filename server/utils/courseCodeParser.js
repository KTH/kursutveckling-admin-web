function parseCourseCode(courseCodeOrAnalysisId) {
  const courseCodeMaxLength = 7

  if (courseCodeOrAnalysisId.length <= courseCodeMaxLength) return courseCodeOrAnalysisId

  // SK2560VT2016_1
  const [courseCodeAndSemester] = courseCodeOrAnalysisId.split('_')
  const semesterStrLength = -6
  const courseCode = courseCodeAndSemester.slice(0, semesterStrLength)
  return courseCode
}

module.exports = { parseCourseCode }
