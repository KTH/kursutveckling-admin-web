'use strict'
import { observable, action, computed, toJS } from 'mobx'
import { computedFn } from "mobx-utils"
import axios from 'axios'

class ArchiveStore {

  @observable language = 1

  @observable archiveFragments = []

  @observable selectedArchiveFragments = []

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

  @action toggleSelectedArchiveFragment(id) {
    if (this.selectedArchiveFragments.includes(id)) {
      const index = this.selectedArchiveFragments.indexOf(id)
      this.selectedArchiveFragments.splice(index, 1)
    } else {
      this.selectedArchiveFragments.push(id)
    }
  }

  @action clearSelectedArchiveFragments() {
      this.selectedArchiveFragments.clear()
  }

  isSelectedArchiveFragment = computedFn(function(id) {
    return this.selectedArchiveFragments.includes(id)
  })

  downloadArchivePackage() {
    axios({
      url: this.paths.api.createArchivePackage.uri,
      method: 'POST',
      data: this.selectedArchiveFragments,
      responseType: 'blob'
    }).then((response) => {
      let blob = (response.data instanceof Blob) ? response.data : new Blob([response.data], {type: 'application/zip'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'archive.zip')
      document.body.appendChild(link)
      link.click()
    }).then(() => {
      this.setRecievedAsExported()
    }).then(() => {
      this.clearSelectedArchiveFragments()
    }
    ).catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
  }
  
  setRecievedAsExported() {
    const selected = toJS(this.selectedArchiveFragments)
    axios({
      url: this.paths.api.setExportedArchiveFragments.uri,
      method: 'PUT',
      data: selected
    }).then((response) => {
      console.log('selected', selected)
      selected.forEach(s => this.setArchiveFragmentAsExported(s))
    }).catch(err => {
      if (err.response) {
        this.errorMessage = err.message
        return err.message
      }
      throw err
    })
  }

  setArchiveFragmentAsExported(id) {
    this.archiveFragments.forEach(archiveFragment => {
      if (archiveFragment._id === id) {
        console.log('Set archiveFragment to exported', id)
        archiveFragment.exported = true
      }
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
