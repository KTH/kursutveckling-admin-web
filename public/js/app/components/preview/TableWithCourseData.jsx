import React from 'react'
import { Table } from 'reactstrap'
import { PopOverTextForTableHeaders, PopoverExamItem } from './PopOverTextForTable'

const TableStandardCells = ({columnsArr, tableTitlesTranslation, popOverId, courseRoundData}) => {
  return columnsArr.map((apiColName, index) =>
    <td className={apiColName} id={apiColName + popOverId} data-label={tableTitlesTranslation[apiColName].header} key={index}>
      <p>{courseRoundData[apiColName]}</p>
    </td>
    )
}

function _getShortAndLongStrForEachExam (examinationRoundsArr) {
  let shortAndLongExamStrArr = []
  if (examinationRoundsArr && examinationRoundsArr.length > 0) {
    shortAndLongExamStrArr = examinationRoundsArr.map(row => {
      let examInfoArr = row.trim().split(';')
      let shortStr = `${examInfoArr[0]} (${examInfoArr[2]}) ${examInfoArr[5]}` || ''
      let longStr = `${examInfoArr[0]} - ${examInfoArr[1]},  ${examInfoArr[2]} ${examInfoArr[3]}, ${examInfoArr[4]}: ${examInfoArr[5]}` || ''
      return [shortStr, longStr]
    })
  }
  return shortAndLongExamStrArr
}

const TableWithCourseData = ({translate, courseRoundObj}) => {
  const orderedColumns = ['responsibles', 'examiners', 'registeredStudents', 'examShortAndLongStrArr', 'examinationGrade', 'alterationText']
  const examShortAndLongStrArr = _getShortAndLongStrForEachExam(courseRoundObj.examinationRounds)
  const popOverId = courseRoundObj._id
  return (
    <span className='table-for-each-round' key={popOverId}>
      <Table>
        <thead>
          <tr>
            {orderedColumns.map((apiColName, index) =>
              <th id={popOverId + index} key={index} className={apiColName}>
                {translate[apiColName].header}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableStandardCells columnsArr={orderedColumns.slice(0, 3)}
              tableTitlesTranslation={translate}
              popOverId={popOverId} courseRoundData={courseRoundObj} />
            <td className='examShortAndLongStrArr' id={'examShortAndLongStrArr' + popOverId} data-label={translate.examShortAndLongStrArr.header}>
              {examShortAndLongStrArr.map((shortAndLongTextStr, index) => <p key={index}>{shortAndLongTextStr[0]}</p>)}
            </td>
            <TableStandardCells columnsArr={orderedColumns.slice(4)}
              tableTitlesTranslation={translate}
              popOverId={popOverId} courseRoundData={courseRoundObj} />
          </tr>
        </tbody>
      </Table>
      <PopOverTextForTableHeaders columnsArr={orderedColumns} translate={translate} popOverId={popOverId} />
      <PopoverExamItem examShortAndLongStrArr={examShortAndLongStrArr} id={'examShortAndLongStrArr' + popOverId} />
    </span>
  )
}
export default TableWithCourseData
