import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router'
import AnalysisMenu from '../../../public/js/app/components/AnalysisMenu'
import mockRouterStore from '../../mocks/mockRouterStore'
import mockedProps from '../../mocks/mockProps'
const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

const RenderAnalysisMenu = ({ userLang = 'en', ...rest }) => {
  const rS = mockRouterStore(userLang)
  return (
    <AnalysisMenu
      routerStore={rS}
      {...rest}
      semesterList={rS.semesters}
      roundList={rS.roundData}
      activeSemester="20192"
      firstVisit={true}
      status="new"
      progress="new"
    />
  )
}

describe('User language: English. Component <RenderAnalysisMenu>', () => {
  beforeEach(() => {
    render(<RenderAnalysisMenu userLang="en" />)
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
    expect(buttons.length).toBe(4)
    expect(buttons[0]).toHaveTextContent('')
    expect(buttons[1]).toHaveTextContent('Välj termin')
    expect(buttons[2]).toHaveTextContent('')
    expect(buttons[3]).toHaveTextContent('Avbryt')
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
