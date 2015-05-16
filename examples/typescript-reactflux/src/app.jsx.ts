/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * Typescript port by Bernd Paradies, May 2015
 * @see https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/app.js
 *
 */

///<reference path="../typings/tsd.d.ts"/>

import React = require('react');
import ReactJSX = require('./react/ReactJSX');
import TodoApp = require('./components/TodoApp.jsx');

React.render(
  ReactJSX(`<TodoApp />`, this, {
    'TodoApp': TodoApp
  }),
  document.getElementById('todoapp')
);
