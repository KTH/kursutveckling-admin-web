import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router-dom/server'
import PdfLinksNav from '../../../public/js/app/components/preview/PdfLinksNav'
import mockWebContext from '../../mocks/mockRouterStore'
import mockedProps from '../../mocks/mockProps'
import mockedMiniMemosPdfAndWeb from '../../mocks/mockMiniMemos'
import mockCourseAnalysis from '../../mocks/mockCourseAnalysis'
import { WebContextProvider } from '../../../public/js/app/context/WebContext'

const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

const RenderPdfLinksNav = ({ userLang = 'en', semester, applicationCodes, ...rest }) => {
  const rS = mockWebContext(userLang)
  return (
    <WebContextProvider
      configIn={{
        ...rS,
        ...mockedMiniMemosPdfAndWeb,
      }}
    >
      <PdfLinksNav
        {...rest}
        translate={i18n.messages[userLang === 'en' ? 0 : 1].messages}
        latestAnalysisFileName={'analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'} // new file was uploaded
        staticAnalysisInfo={mockCourseAnalysis(semester, applicationCodes)}
        langIndex={userLang === 'en' ? 0 : 1}
      />
    </WebContextProvider>
  )
}

describe('User language: English. Component <PdfLinksNav>: one application code, one pdf memo', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="en" semester="20172" applicationCodes="1" />)
  })
  test('renders a pdf links navigation for a table', done => {
    done()
  })

  test('renders links Course memo EI1220 Autumn 2017-1 and Course analysis: 5 Sept 2019', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(2)
    expect(twoDocLinks[0]).toHaveTextContent('Course memo EI1220 Autumn 2017-1')
    expect(twoDocLinks[0].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2017_1.pdf'
    )

    expect(twoDocLinks[1]).toHaveTextContent('Course analysis: 5 Sept 2019')
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })
})

describe('User language: Swedish. Component <PdfLinksNav>: one application code one pdf memo ', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="sv" semester="20172" applicationCodes="1" />)
  })
  test('renders a pdf links navigation for a table', done => {
    done()
  })

  test('renders links Course memo EI1220 Autumn 2017-1 and Course analysis: 5 Sept 2019', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(2)
    expect(twoDocLinks[0]).toHaveTextContent('Kurs-PM EI1220 HT 2017-1')
    expect(twoDocLinks[0].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2017_1.pdf'
    )

    expect(twoDocLinks[1]).toHaveTextContent('Kursanalys: 2019-09-05')
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })
})

describe('User language: English. Component <PdfLinksNav>: two ladok round ids, two pdf memos', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="en" semester="20192" applicationCodes="1,2" />)
  })

  test('renders 2 memo pdf links and one course analysis', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(3)
    expect(twoDocLinks[0]).toHaveTextContent('Course memo EI1220 Autumn 2019-1')
    expect(twoDocLinks[0].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2019_1.pdf'
    )

    expect(twoDocLinks[1]).toHaveTextContent('Course memo EI1220 Autumn 2019-2')
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2019_2.pdf'
    )

    expect(twoDocLinks[2]).toHaveTextContent('Course analysis: 5 Sept 2019')
    expect(twoDocLinks[2].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })
})

describe('User language: Swedish. Component <PdfLinksNav>: two ladok round ids, two pdf memos', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="sv" semester="20192" applicationCodes="1,2" />)
  })

  test('renders 2 memo pdf links and one course analysis', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(3)
    expect(twoDocLinks[0]).toHaveTextContent('Kurs-PM EI1220 HT 2019-1')
    expect(twoDocLinks[0].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2019_1.pdf'
    )

    expect(twoDocLinks[1]).toHaveTextContent('Kurs-PM EI1220 HT 2019-2')
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2019_2.pdf'
    )

    expect(twoDocLinks[2]).toHaveTextContent('Kursanalys: 2019-09-05')
    expect(twoDocLinks[2].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })
})

describe('User language: English. Component <PdfLinksNav>: two lapplication code, one pdf memos and one web based', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="en" semester="20192" applicationCodes="1,3" />)
  })

  test('renders 2 memo links (memo pdf and memo web based) and one course analysis', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(3)

    expect(twoDocLinks[0]).toHaveTextContent('Course memo EI1220 Autumn 2019-1')
    expect(twoDocLinks[0].href).toStrictEqual(
      'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/pm-EI1220HT2019_1.pdf'
    )

    expect(twoDocLinks[1]).toHaveTextContent('Course memo EI1220 Autumn 2019-3')
    expect(twoDocLinks[1].href).toStrictEqual('https://localhost:3000/kurs-pm/EI1220/memoEI1220201923')

    expect(twoDocLinks[2]).toHaveTextContent('Course analysis: 5 Sept 2019')
    expect(twoDocLinks[2].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })
})

describe('User language: English. Component <PdfLinksNav>: two application codes, only one web based', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="en" semester="20192" applicationCodes="3,9" />)
  })

  test('renders 1 active memo link for round 3 and one course analysis', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(2)
    expect(twoDocLinks[0]).toHaveTextContent('Course memo EI1220 Autumn 2019-3')
    expect(twoDocLinks[0].href).toStrictEqual('https://localhost:3000/kurs-pm/EI1220/memoEI1220201923')

    expect(twoDocLinks[1]).toHaveTextContent('Course analysis: 5 Sept 2019')
    expect()
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })

  test('renders disabled link for non-existing course memo for round 9', () => {
    const disabledLink = getByText('Missing a published course memo')
    expect(disabledLink).toBeInTheDocument()
  })
})

describe('User language: Swedish. Component <PdfLinksNav>: two application codes, only one web based', () => {
  beforeEach(() => {
    render(<RenderPdfLinksNav userLang="sv" semester="20192" applicationCodes="3,9" />)
  })

  test('renders 1 active memo link for round 3 and one course analysis', () => {
    const twoDocLinks = getAllByRole('link')
    expect(twoDocLinks.length).toBe(2)
    expect(twoDocLinks[0]).toHaveTextContent('Kurs-PM EI1220 Autumn 2019-3')
    expect(twoDocLinks[0].href).toStrictEqual('https://localhost:3000/kurs-pm/EI1220/memoEI1220201923')

    expect(twoDocLinks[1]).toHaveTextContent('Kursanalys: 2019-09-05')
    expect()
    expect(twoDocLinks[1].href).toStrictEqual(
      'https://kursinfostoragestage/kursutveckling-blob-container/analysis-EI1220HT2017_1-newCourseAnalysisFile.pdf'
    )
  })

  test('renders disabled link for non-existing course memo for round 9', () => {
    const disabledLink = getByText('Saknas ett publicerat kurs-PM')
    expect(disabledLink).toBeInTheDocument()
  })
})
