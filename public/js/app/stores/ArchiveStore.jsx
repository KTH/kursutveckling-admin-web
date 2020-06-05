'use strict'
import { observable, action } from 'mobx'
import axios from 'axios'

class ArchiveStore {

  @observable language = 1

  @observable archiveFragments = []

  @observable archivePackage
  
  @action setBrowserConfig(config, paths, apiHost, profileBaseUrl) {
    this.browserConfig = config
    this.paths = paths
    this.apiHost = apiHost
    this.profileBaseUrl = profileBaseUrl
  }

  @action __SSR__setCookieHeader(cookieHeader) {
    if (typeof window === 'undefined') {
      this.cookieHeader = cookieHeader || ''
    }
  }

  @action doSetLanguage(lang) {
    this.language = lang
  }

  @action setArchivePackage(archivePackage) {
    this.archivePackage = archivePackage
  }

  @action downloadArchivePackage(selected) {
    axios({
      url: this.paths.api.createArchivePackage.uri,
      method: 'POST',
      data: {selected},
      responseType: 'blob'
    }).then((response) => {
      let blob = (response.data instanceof Blob) ? response.data : new Blob([response.data], {type: 'application/zip'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'archive.zip')
      document.body.appendChild(link)
      link.click()
    }).catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
  }

  initializeStore(storeName) {
    const store = this

    if (typeof window !== 'undefined' && window.__initialState__ && window.__initialState__[storeName]) {
      const tmp = JSON.parse(decodeURIComponent(window.__initialState__[storeName]))
      for (let key in tmp) {
        store[key] = tmp[key]
        delete tmp[key]
      }

      // Just a nice helper message
      if (Object.keys(window.__initialState__).length === 0) {
        window.__initialState__ = 'Mobx store state initialized'
      }
    }
  }
}

export default ArchiveStore
