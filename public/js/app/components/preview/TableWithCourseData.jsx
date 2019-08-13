import React from 'react'
import { Table, Button } from 'reactstrap'
import { PopOverTextForTableHeaders, PopoverExamItem } from './PopOverTextForTable'


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

const MobileLabelForTableWithInfo = ({translate, id}) => {
  return (
    <span className='mobile-header-popovers'>
      <label>{translate.header}</label>
      {' '}
      <Button id={id} type='button' className='mobile btn-info-modal' />
      {' '}
    </span>
  )
}

const TableStandardCells = ({columnsArr, tableTitlesTranslation, popOverId, courseRoundData}) => {
  return columnsArr.map((apiColName, index) =>
    <td className={apiColName} id={apiColName + popOverId} key={index}>
      <MobileLabelForTableWithInfo translate={tableTitlesTranslation[apiColName]}
        id={'labelfor' + popOverId + apiColName}
      />
      <p>{courseRoundData[apiColName]} 
      {apiColName === 'examinationGrade' ? ' %' : ''}
      {apiColName === 'examinationGrade' && courseRoundData.examinationGradeFromLadok === false ? ' *' : ''}
      {apiColName === 'registeredStudents' && courseRoundData.registeredStudentsFromLadok === false ? ' *' : ''}
      </p>
    </td>
    )
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
               <th key={index} className={apiColName}>
                {translate[apiColName].header}
                {' '}
                <Button id={popOverId + apiColName} type='button' className='desktop btn-info-modal' />
                {' '}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableStandardCells columnsArr={orderedColumns.slice(0, 3)}
              tableTitlesTranslation={translate}
              popOverId={popOverId} courseRoundData={courseRoundObj} />
             <td className='examShortAndLongStrArr' id={'examShortAndLongStrArr' + popOverId}>
              <MobileLabelForTableWithInfo translate={translate.examShortAndLongStrArr}
                id={'labelfor' + popOverId + 'examShortAndLongStrArr'}
              />
              {examShortAndLongStrArr.map((shortAndLongTextStr, index) => <p key={index}>{shortAndLongTextStr[0]}</p>)}
            </td>
            <TableStandardCells columnsArr={orderedColumns.slice(4)}
              tableTitlesTranslation={translate}
              popOverId={popOverId} courseRoundData={courseRoundObj} />
          </tr>
        </tbody>
      </Table>
      <PopOverTextForTableHeaders columnsArr={orderedColumns} translate={translate} popOverId={popOverId} key = {'headers_'+popOverId}/>
      <PopoverExamItem examShortAndLongStrArr={examShortAndLongStrArr} id={'examShortAndLongStrArr' + popOverId} />
    </span>
  )
}
export default TableWithCourseData
