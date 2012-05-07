// Copyright 2005 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Helper object to manage the event system pools. This should not
 * be used by itself and there should be no reason for you to depend on this
 * library.
 *
 * @deprecated goog.events.pools() is not needed by Closure anymore.  A stub
 * remains in place for those who are incorrectly depending on this file.
 *
 */

goog.provide('goog.events.pools');

goog.require('goog.events');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.Listener');


/**
 * Helper function for returning an object that is used for the lookup trees.
 * This might use an object pool depending on the script engine.
 * @return { {count_: number, remaining_: number} } A new or reused object.
 */
goog.events.pools.getObject = function() {
  return {count_: 0, remaining_: 0};
};


/**
 * Helper function for releasing an object that was returned by
 * {@code goog.events.pools.getObject}. In case an object pool was used the
 * object is returned to the pool.
 * @param { {count_: number, remaining_: number} } obj The object to release.
 */
goog.events.pools.releaseObject = goog.nullFunction;


/**
 * Helper function for returning an array.
 * This might use an object pool depending on the script engine.
 * @return {Array} A new or reused array.
 */
goog.events.pools.getArray = function() {
  return [];
};


/**
 * Helper function for releasing an array that was returned by
 * {@code goog.events.pools.getArray}. In case an object pool was used the
 * array is returned to the pool.
 * @param {Array} arr The array to release.
 */
goog.events.pools.releaseArray = goog.nullFunction;


/**
 * Helper function for returning a proxy function as needed by
 * {@code goog.events}. This might use an object pool depending on the script
 * engine.
 * @return {Function} A new or reused function object.
 */
goog.events.pools.getProxy = function() {
  return goog.events.getProxy();
};


/**
 * Sets the callback function to use in the proxy.
 * @param {function(string, (Event|undefined))} cb The callback function to use.
 */
goog.events.pools.setProxyCallbackFunction = function(cb) {
  goog.events.pools.proxyCallbackFunction_ = cb;
};


/**
 * Helper function for releasing a function that was returned by
 * {@code goog.events.pools.getProxy}. In case an object pool was used the
 * function is returned to the pool.
 * @param {Function} f The function to release.
 */
goog.events.pools.releaseProxy = goog.nullFunction;


/**
 * Helper function for returning a listener object as needed by
 * {@code goog.events}. This might use an object pool depending on the script
 * engine.
 * @return {goog.events.Listener} A new or reused listener object.
 */
goog.events.pools.getListener = function() {
  return new goog.events.Listener();
};


/**
 * Helper function for releasing a listener object that was returned by
 * {@code goog.events.pools.getListener}. In case an object pool was used the
 * listener object is returned to the pool.
 * @param {goog.events.Listener} listener The listener object to release.
 */
goog.events.pools.releaseListener = goog.nullFunction;


/**
 * Helper function for returning a {@code goog.events.BrowserEvent} object as
 * needed by {@code goog.events}. This might use an object pool depending on the
 * script engine.
 * @return {!goog.events.BrowserEvent} A new or reused event object.
 */
goog.events.pools.getEvent = function getEvent() {
  return new goog.events.BrowserEvent();
};


/**
 * Helper function for releasing a browser event object that was returned by
 * {@code goog.events.pools.getEvent}. In case an object pool was used the
 * browser event object is returned to the pool.
 * @param {goog.events.BrowserEvent} event The event object to release.
 */
goog.events.pools.releaseEvent = goog.nullFunction;
