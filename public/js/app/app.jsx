'use strict'
import '@babel/polyfill'

import React from 'react'
import  ReactDOM from 'react-dom'
import { Component } from 'react'
import { Provider, inject } from 'mobx-react'
import {  BrowserRouter, Route, Switch} from 'react-router-dom'
import { configure } from 'mobx'
import queryString from 'query-string'

import { IMobxStore } from './interfaces/utils'
import { StaticRouter } from 'react-router'
import RouterStore from './stores/RouterStore'
//import AdminForm from './views/AdminForm'
import AdminPage from './views/AdminPage'
import  '../../css/kursutveckling-admin.scss'
import { log } from 'util';

/* const routerStore = new RouterStore()
if (typeof window !== 'undefined') {
  routerStore.initializeStore('routerStore')
}
createUtility({
  implements: IMobxStore,
  name: 'RouterStore',
  store: routerStore
}).registerWith(globalRegistry)
//routerStore.initializeStore('routerStore') */

function staticFactory () {
  return (
    <StaticRouter >
      { appFactory() }
    </StaticRouter>
  )
}

function appFactory() {

  if (process.env['NODE_ENV'] !== 'production') {
    configure({
      isolateGlobalState: true
    })
  }

  const routerStore = new RouterStore()

  if (typeof window !== 'undefined') {
    routerStore.initializeStore('routerStore')
  }

  /*createUtility({
    implements: IMobxStore,
    name: 'RouterStore',
    store: routerStore
  }).registerWith(globalRegistry)*/

  return (
    <Provider routerStore={routerStore}>
      <Switch>
        <Route path='/kursinfoadmin/kursutveckling' component={AdminPage} asyncBefore={AdminPage.fetchData} />
        <Route path='/kursinfoadmin/kursutveckling/preview' component={AdminPage} />
      </Switch>
    </Provider>

  )
}

function doAllAsyncBefore ({
  pathname,
  query,
  routerStore,
  routes}) 
{
  const queryParams = queryString.parse(query)

  /*const matches = routes.map((route) => {
    const { exact, leaf, path, asyncBefore} = route.props
    return {
      match: matchPath(pathname, { path, exact: leaf } ),
      query: queryParams,
      asyncBefore
    }
  })*/

  /*if (asyncBefore) {
    return asyncBefore(routerStore, match, query)
  }*/
  
  return Promise.resolve()
}

@inject(['routerStore'])
class ProgressLayer extends Component {
  constructor (props, context) {
    super(props)
    this.state = {
      context,
      id:"test"
    }

    //this.doContinueNavigation = this.doContinueNavigation.bind(this)
    //this.doCancelNavigation = this.doCancelNavigation.bind(this)
    //this.didChangeLocation = this.didChangeLocation.bind(this)
  }

  getChildContext () {
    return this.state.context
  }

 

  componentWillReceiveProps (nextProps, nextContext) {
    if (nextContext.router.route.location.key !== this.context.router.route.location.key) {
      const asyncBeforeProps = {
        pathname: nextContext.router.route.location.pathname,
        query: nextContext.router.route.location.search,
        routerStore: nextProps.routerStore,
        routes: nextProps.children.props.children,
        nextContext,
        nextProps
      }


      // Continue with page change
      doAllAsyncBefore (asyncBeforeProps).then((res) => {
        this.setState({ context: nextContext })
      })
    }
  }

  doContinueNavigation() {
    this.props.routerStore.didCancelEdits()

    if (this.asyncBeforeProps) {
      return doAllAsyncBefore (this.asyncBeforeProps).then((res) => {
        this.setState({
          context: this.asyncBeforeProps.nextContext,
          showIsEditingModal: false
        })
        this.asyncBeforeProps = undefined
      })

    }

    // Leaving page
  }


doCancelNavigation() {
  // Revert the addressbar since it is changed prior to reaching the modal
  this.state.context.router.history.replace(this.state.context.router.route.location.pathname)
  this.setState({
    showIsEditingModal: false
  })
  this.asyncBeforeProps = undefined
}

render ({ routerStore }) {
 //console.log("this.props",this.props)
  return (
    <div>
      {this.props.children}
    </div>
  )
}
}

if (typeof window !== 'undefined') {
  ReactDOM.render(<BrowserRouter>{appFactory()}</BrowserRouter>, document.getElementById('kth-kursutveckling-admin'))
}

export { 
staticFactory
}