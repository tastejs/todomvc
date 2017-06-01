'use strict';

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
const store = configureStore()

import App from './containers/App'
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

import * as logic from './gateway/logic'
logic.authorizeApplicationOrConfirmObtainedToken(store)
  .then(() => logic.getTodosFileOrPutInitialFromApplicationState(store) )
