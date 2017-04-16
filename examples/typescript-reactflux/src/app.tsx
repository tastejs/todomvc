/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

///<reference path="../typings/tsd.d.ts"/>

import React = require('react');

import TodoApp = require('./components/TodoApp.react');

React.render(
  React.jsx(`<TodoApp />`),
  document.getElementById('todoapp')
);
