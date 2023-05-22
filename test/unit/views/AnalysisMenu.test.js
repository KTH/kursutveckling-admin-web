import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router-dom/server'
import AnalysisMenu from '../../../public/js/app/components/AnalysisMenu'
import mockWebContext from '../../mocks/mockRouterStore'
import mockedProps from '../../mocks/mockProps'
const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

const RenderAnalysisMenu = ({ userLang = 'en', semester, ...rest }) => {
  const rS = mockWebContext(userLang)
  return (
    <AnalysisMenu
      context={rS}
      {...rest}
      semesterList={rS.semesters}
      roundList={rS.roundData}
      activeSemester={semester}
      firstVisit={true}
      status="new"
      progress="new"
    />
  )
}

describe('User language: English. Component <RenderAnalysisMenu>', () => {
  beforeEach(() => {
    render(<RenderAnalysisMenu userLang="en" semester="20192" />)
  })
  test('renders a course development page', done => {
    done()
  })
  test('renders headers h3', () => {
    const allH3Headers = getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(2)
    expect(allH3Headers[0]).toHaveTextContent('Välj termin')
    expect(allH3Headers[1]).toHaveTextContent('Välj kursomgång')
  })

  test('renders buttons. English.', () => {
    const buttons = getAllByRole('button')
    expect(buttons.length).toBe(3)
    expect(buttons[0]).toHaveTextContent('')
    expect(buttons[1]).toHaveTextContent('')
    expect(buttons[2]).toHaveTextContent('Avbryt')
  })

  test('renders checkbox for course offering which does not have a published course data', () => {
    const checkboxes = getAllByRole('checkbox')
    expect(checkboxes.length).toBe(1)
  })

  test('renders HT 2019 dropdown elements', () => {
    const label = screen.getByText('HT 2019')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2021 dropdown elements', () => {
    const label = screen.getByText('VT 2021')
    expect(label).toBeInTheDocument()
  })

  test('renders HT 2020 dropdown elements', () => {
    const label = screen.getByText('HT 2020')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2020 dropdown elements', () => {
    const label = screen.getByText('VT 2020')
    expect(label).toBeInTheDocument()
  })
})

describe('when flag state in roundList takes different values', () => {
  beforeEach(() => {
    render(<RenderAnalysisMenu userLang="en" semester="20221" />)
  })
  test('renders a course development page', done => {
    done()
  })

  test('renders checkbox for course offering which does not have a published course data and state = APPROVED or FULL', () => {
    const checkboxes = getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
  })
})
