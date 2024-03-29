import { addClientFunctionsToWebContext } from '../../public/js/app/client-context/addClientFunctionsToWebContext'
// import transformedAnalysisData from '../mocks/transformedAnalysisData'
// import transformedKoppsData from '../mocks/transformedKoppsData'

const storeFunctions = addClientFunctionsToWebContext()

const mockWebContext = (userLang = 'en') => {
  const routerWithData = {
    ...storeFunctions,
    language: 1,
    courseData: { courseCode: 'EF1111', gradeScale: { PF: 'P, F' }, semesterObjectList: {} },
    courseTitle: { name: 'Project in Plasma Physics', credits: '9.0' },
    // courseKoppsData: transformedKoppsData(userLang),
    // analysisData: transformedAnalysisData,
    browserConfig: {
      env: 'dev',
      hostUrl: 'https://localhost:3000',
      port: 3000,
      proxyPrefixPath: { uri: '/kursinfoadmin/kursutveckling' },
      storageUri: 'https://kursinfostoragestage/kursutveckling-blob-container/',
      memoStorageUri: 'https://kursinfostoragestage.blob.core.windows.net/memo-blob-container/',
      useSsl: false,
    },
    usedRounds: {
      draftAnalysis: [],
      publishedAnalysis: [
        {
          analysisFileName: 'analysis-EF1111HT2019_2.pdf',
          analysisId: 'EF1111HT2019_2',
          analysisName: 'Autumn  2019-2 ( Start date  26/08/2019, English )',
          canBeAccessedByUser: true,
          isPublished: true,
          ugKeys: ['EF1111.examiner', 'EF1111.20192.2.courseresponsible'],
          user: 'elenara',
        },
      ],
      usedRounds: ['2'],
    },
    semesters: ['20221', '20211', '20202', '20201', '20192'],
    roundData: {
      20192: [
        {
          endDate: '2019-10-25',
          canBeAccessedByUser: true,
          ladokUID: 'd',
          language: 'English',
          shortName: '',
          startDate: '2019-08-26',
          targetGroup: [],
          applicationCode: '2',
          state: 'APPROVED',
        },
        {
          endDate: '2020-01-14',
          canBeAccessedByUser: true,
          ladokUID: '6413t1tt685',
          language: 'English',
          shortName: '',
          startDate: '2019-10-28',
          targetGroup: [],
          applicationCode: '1',
          state: 'APPROVED',
        },
      ],
      20201: [
        {
          endDate: '2020-03-14',
          canBeAccessedByUser: true,
          ladokUID: 'ca29ft7a3',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2020-01-15',
          targetGroup: [],
          state: 'FULL',
        },
        {
          endDate: '2020-06-01',
          canBeAccessedByUser: true,
          ladokUID: 'c38bc898-f2f4-11e8-9614-d09e533d4323',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2020-03-16',
          targetGroup: [],
          state: 'CANCELLED',
        },
      ],
      20202: [
        {
          endDate: '2020-10-23',
          canBeAccessedByUser: true,
          ladokUID: '3,f-,',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2020-08-24',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2021-01-15',
          canBeAccessedByUser: true,
          ladokUID: '208f6ed8-36b6-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2020-10-26',
          targetGroup: [],
          state: 'APPROVED',
        },
      ],
      20211: [
        {
          endDate: '2021-03-19',
          canBeAccessedByUser: true,
          ladokUID: 'c1217dba-3612-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2021-01-18',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2021-06-08',
          canBeAccessedByUser: true,
          ladokUID: 'b5ah3989f-36k13',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2021-03-22',
          state: 'APPROVED',
        },
      ],
      20221: [
        {
          endDate: '2022-03-19',
          canBeAccessedByUser: true,
          ladokUID: 'c1217dba-3612-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2022-01-18',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2022-06-08',
          canBeAccessedByUser: true,
          ladokUID: 'b5ah3989f-36k13',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2022-03-22',
          state: 'APPROVED',
        },
        {
          endDate: '2022-03-19',
          canBeAccessedByUser: true,
          ladokUID: 'c1217dba-3612-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '3',
          shortName: '',
          startDate: '2022-01-18',
          targetGroup: [],
          state: 'FULL',
        },
        {
          endDate: '2022-06-08',
          canBeAccessedByUser: true,
          ladokUID: 'b5ah3989f-36k13',
          language: 'English',
          applicationCode: '4',
          shortName: '',
          startDate: '2022-03-22',
          state: 'CANCELLED',
        },
      ],
    },
    tempData: null,
    statistics: { examinationGrade: 99, endDate: null, registeredStudents: 10 },
    getUsedRounds(semester) {
      return Promise.resolve({
        draftAnalysis: [],
        publishedAnalysis: [
          {
            analysisFileName: 'analysis-EF1111HT2019_2.pdf',
            analysisId: 'EF1111HT2019_2',
            analysisName: 'Autumn  2019-2 ( Start date  26/08/2019, English )',
            canBeAccessedByUser: true,
            isPublished: true,
            ugKeys: ['EF1111.examiner', 'EF1111.20192.2.courseresponsible'],
            user: 'elenara',
          },
        ],
        usedRounds: ['2'],
      })
    },
  }

  return routerWithData
}

export default mockWebContext
