/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

/** @type {Promise<void>} */
let readyPromise = null;

/** @type {?function(?function())} */
let whenReady = window['HTMLImports'] && window['HTMLImports']['whenReady'] || null;

/** @type {function()} */
let resolveFn;

/**
 * @param {?function()} callback
 */
export default function documentWait(callback) {
  if (whenReady) {
    whenReady(callback)
  } else {
    if (!readyPromise) {
      readyPromise = new Promise((resolve) => {resolveFn = resolve});
      if (document.readyState === 'complete') {
        resolveFn();
      } else {
        document.addEventListener('readystatechange', () => {
          if (document.readyState === 'complete') {
            resolveFn();
          }
        });
      }
    }
    readyPromise.then(function(){ callback && callback(); });
  }
}