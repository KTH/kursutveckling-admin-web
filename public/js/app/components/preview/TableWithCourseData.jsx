import React from 'react'
import { Table } from 'reactstrap'
// import { PopOverTextForTableHeaders, PopoverExamItem } from './PopOverTextForTable'
import ControlledPopover from './PopOverTextForTable'

function _getListOfExamRounds(rawExamRoundsStrArr) {
  let listOfShortStrForExamRounds = []
  if (rawExamRoundsStrArr && rawExamRoundsStrArr.length > 0) {
    listOfShortStrForExamRounds = rawExamRoundsStrArr.map(row => {
      const examInfoArr = row.trim().split(';')
      return `${examInfoArr[0]} (${examInfoArr[2]}) ${examInfoArr[5]}` || ''
    })
  }
  return listOfShortStrForExamRounds
}

const TableWithCourseData = ({ translate, thisAnalysisObj }) => {
  const {
    examinationGradeFromLadok,
    registeredStudentsFromLadok,
    examinationRounds: rawExamsData,
    _id: analysisId,
  } = thisAnalysisObj
  const listOfExamRounds = _getListOfExamRounds(rawExamsData)
  const orderedColumns = [
    'responsibles',
    'examiners',
    'registeredStudents',
    'examRounds',
    'examinationGrade',
    'alterationText',
  ]
  return (
    <Table className="table-for-each-course-offering" key={analysisId}>
      <thead>
        <tr>
          {orderedColumns.map((colName, index) => {
            const cellId = analysisId + colName
            const ariaDescribedBy = 'header-description' + cellId
            const { header, popoverText } = translate[colName]
            return (
              <th key={index} className={colName}>
                {header}{' '}
                <ControlledPopover cellId={cellId} header={header} popoverText={popoverText} popType="desktop" />{' '}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        <tr>
          {orderedColumns.map((colName, index) => {
            const { header, popoverText } = translate[colName]
            const cellId = analysisId + colName
            return (
              <td className={colName} id={cellId} key={index}>
                <ControlledPopover cellId={cellId} header={header} popoverText={popoverText} popType="mobile" />
                {(colName === 'examRounds' && listOfExamRounds.map((exam, index) => <p key={index}>{exam}</p>)) || (
                  <p>
                    {`${thisAnalysisObj[colName]}${
                      (colName === 'examinationGrade' && (!examinationGradeFromLadok ? ' % *' : ' %')) || ''
                    }${(colName === 'registeredStudents' && (!registeredStudentsFromLadok ? ' *' : '')) || ''}`}
                  </p>
                )}
              </td>
            )
          })}
        </tr>
      </tbody>
    </Table>
  )
}
export default TableWithCourseData
