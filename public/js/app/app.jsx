import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { hydrateRoot } from 'react-dom/client'
import { WebContextProvider } from './context/WebContext'
import { uncompressData } from './context/compress'
import AdminPage from './views/AdminPage'
import '../../css/kursutveckling-web.scss'
import '../../css/kursutveckling-admin.scss'

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
  hydrateRoot(domElement, app)
}

_renderOnClientSide()

export default appFactory
