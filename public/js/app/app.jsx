import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import AdminPage from './views/AdminPage'
import '../../css/kursutveckling-web.scss'
import '../../css/kursutveckling-admin.scss'

function _renderOnClientSide() {
  const isClientSide = typeof window !== 'undefined'

  if (!isClientSide) {
    return
  }

  const webContext = {}
  uncompressData(webContext)

  const basename = webContext.proxyPrefixPath.uri

  const app = <BrowserRouter basename={basename}>{appFactory({}, webContext)}</BrowserRouter>

  // Removed basename because it is causing empty string basename={basename}
  const domElement = document.getElementById('app')
  ReactDOM.hydrate(app, domElement)
}

_renderOnClientSide()

function appFactory(applicationStore, context) {
  return (
    <WebContextProvider configIn={context}>
      <Routes>
        <Route exact path="/:id" element={<AdminPage />} />
        <Route exact path="/preview/:id" element={<AdminPage />} />
      </Routes>
    </WebContextProvider>
  )
}

export default appFactory
