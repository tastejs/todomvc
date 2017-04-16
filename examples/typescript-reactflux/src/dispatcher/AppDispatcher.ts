/*
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * AppDispatcher
 *
 * A singleton that operates as the central hub for application updates.
 */

///<reference path="../../typings/flux/flux.d.ts"/>

import flux = require('flux');
var Dispatcher: flux.Dispatcher<TodoAction> = new flux.Dispatcher();

export = Dispatcher;
